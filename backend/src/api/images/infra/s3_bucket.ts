import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	S3Client,
	UploadPartCommand,
	_Object,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Readable } from 'stream';

type BucketFile = string | Uint8Array | Buffer | Readable;

export class Bucket {
	public readonly S3: S3Client;

	constructor(
		readonly BucketName: string,
		readonly S3_API_URL: string,
		readonly S3_ACCESS_KEY_ID: string,
		readonly S3_SECRET_ACCESS_KEY: string
	) {
		this.S3 = new S3Client({
			region: 'auto',
			endpoint: S3_API_URL,
			credentials: {
				accessKeyId: S3_ACCESS_KEY_ID,
				secretAccessKey: S3_SECRET_ACCESS_KEY,
			},
		});
	}

	private async getObjectData(key: string) {
		return await this.S3.send(new GetObjectCommand({ Bucket: this.BucketName, Key: key }));
	}

	private async streamToBlob(stream: ReadableStream) {
		const response = new Response(stream);
		const blob = await response.blob();
		return blob;
	}

	private blobToFile(blob: Blob, filename: string) {
		const file = new File([blob], filename, { type: blob.type });
		return file;
	}

	private async fetchFileFromS3AndConvertToFile(key: string, filename: string) {
		try {
			const objectData = await this.getObjectData(key);

			if (objectData.Body instanceof ReadableStream) {
				const blob = await this.streamToBlob(objectData.Body);
				return this.blobToFile(blob, filename);
			} else {
				throw new Error('Received body is not a ReadableStream.');
			}
		} catch (error) {
			console.error('Error fetching file from S3:', error);
			throw error;
		}
	}

	private async retrieveItemsAsFiles(item: _Object) {
		if (item?.Key) {
			const filename = item.Key.split('/').pop();

			if (filename) {
				return await this.fetchFileFromS3AndConvertToFile(item.Key, filename);
			}
		}
	}

	async uploadFile(file: BucketFile, key: string, contentType: string) {
		const createMultipartInput = {
			Bucket: this.BucketName,
			Key: key,
			ContentType: contentType,
		};

		const multipartUploadResponse = await this.S3.send(new CreateMultipartUploadCommand(createMultipartInput));

		const uploadPartInput = {
			...createMultipartInput,
			Body: file,
			UploadId: multipartUploadResponse.UploadId,
			PartNumber: 1,
		};
		const partUploadResponse = await this.S3.send(new UploadPartCommand(uploadPartInput));

		const completeParams = {
			...createMultipartInput,
			UploadId: multipartUploadResponse.UploadId,
			MultipartUpload: {
				Parts: [
					{
						ETag: partUploadResponse.ETag,
						PartNumber: 1,
					},
				],
			},
		};

		await this.S3.send(new CompleteMultipartUploadCommand(completeParams));
	}

	async listAllContent() {
		return await this.S3.send(new ListObjectsV2Command({ Bucket: this.BucketName }));
	}

	async getItemByKey(key: string) {
		const list = await this.listAllContent();

		const item = list.Contents?.find((item) => item.Key?.match(key));

		return item && (await this.retrieveItemsAsFiles(item));
	}

	async getItemsByEntity(entity: string) {
		const list = await this.listAllContent();

		const items = list.Contents?.filter((item) => item.Key?.match(entity));

		return items ? await Promise.all(items.map((item) => item && this.retrieveItemsAsFiles(item))) : [];
	}

	async deleteItemByKey(key: string) {
		try {
			const url = await getSignedUrl(this.S3, new DeleteObjectCommand({ Bucket: this.BucketName, Key: key }), { expiresIn: 3600 });

			await fetch(url, {
				method: 'DELETE',
			});
		} catch (error) {
			console.log('bucket error', error);
		}
	}
}
