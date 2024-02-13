import {
	DeleteImageByKeyPorts,
	GetImageByKeyPorts,
	GetImagesByEntityPorts,
	ImagesPorts,
	UploadImagePorts,
} from '../application/images.ports';
import { BucketInfra } from '../infra/bucket_infra';
import { mapBucketImageToApp } from './mapper/mapBucketImagetoApp';

export class ImageBucketAdapter implements ImagesPorts {
	constructor(protected readonly bucket: BucketInfra) {}

	async getImagesByEntity({ entity, env }: GetImagesByEntityPorts.Input): Promise<GetImagesByEntityPorts.Output> {
		const bucketObjectList = await this.bucket.getItemsByEntity(entity, env);

		if (bucketObjectList) {
			return {
				images: bucketObjectList.map((obj) => mapBucketImageToApp(obj)),
			};
		} else {
			return {
				images: [],
			};
		}
	}

	async getImageByKey({ key, env }: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output> {
		const bucketObject = await this.bucket.getItemByKey(key, env);

		return {
			image: mapBucketImageToApp(bucketObject),
		};
	}

	async uploadImage({ file, key, type, env }: UploadImagePorts.Input): Promise<UploadImagePorts.Output> {
		const fileBuffer = await (file as unknown as File).arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		const imagedb = await this.bucket.uploadImage(uint8Array, key, type, env);

		return {
			image: mapBucketImageToApp(imagedb),
		};
	}

	async deleteImageByKey({ key, env }: DeleteImageByKeyPorts.Input): Promise<void> {
		await this.bucket.deleteItemByKey(key, env);
	}
}
