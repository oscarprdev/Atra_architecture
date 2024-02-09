import { BucketInfra } from '../infra/bucket_infra';
import { mapBucketImageToApp } from '../mappers/mapBucketImagetoApp';
import { HttpAdapterTypes } from './http_adapter.types';

export class HttpAdapter {
	constructor(protected readonly bucket: BucketInfra) {}

	async getImageByKey({ key, env }: HttpAdapterTypes.GetImageByKeyInput): Promise<HttpAdapterTypes.GetImageByKeyOutput> {
		const bucketObject = await this.bucket.getItemByKey(key, env);

		return {
			image: mapBucketImageToApp(bucketObject),
		};
	}

	async uploadImageToBucket({ file, key, type, env }: HttpAdapterTypes.UploadImageInput): Promise<HttpAdapterTypes.UploadImageOutput> {
		const fileBuffer = await (file as unknown as File).arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		const imagedb = await this.bucket.uploadImage(uint8Array, key, type, env);

		return {
			image: mapBucketImageToApp(imagedb),
		};
	}

	async deleteItemByKey({ key, env }: HttpAdapterTypes.DeleteItemByKeyPortsInput): Promise<void> {
		await this.bucket.deleteItemByKey(key, env);
	}
}
