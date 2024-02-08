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
}
