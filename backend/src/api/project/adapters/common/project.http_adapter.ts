import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectHttpAdapterTypes } from './project.http_adapter.types';

export class ProjectHttpAdapter {
	constructor(protected readonly bucket: BucketInfra) {}

	async getImageByKey({ key, env }: ProjectHttpAdapterTypes.GetImageByKeyInput): Promise<ProjectHttpAdapterTypes.GetImageByKeyOutput> {
		const bucketObject = await this.bucket.getItemByKey(key, env);

		if (
			bucketObject &&
			bucketObject.Key &&
			bucketObject.ETag &&
			bucketObject.Size &&
			bucketObject.StorageClass &&
			bucketObject.LastModified
		) {
			return {
				image: {
					Key: bucketObject.Key,
					ETag: bucketObject.ETag,
					Size: bucketObject.Size,
					StorageClass: bucketObject.StorageClass,
					LastModified: bucketObject.LastModified.toString(),
					Type: '',
				},
			};
		} else {
			throw new Error(JSON.stringify({ status: 500, message: 'Bucket Image file is undefined' }));
		}
	}
}
