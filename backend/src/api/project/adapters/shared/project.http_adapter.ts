import { BucketInfra } from '../../infra/bucket_infra';
import { mapBucketImageToApp } from './mappers/mapBucketImagetoApp';
import { ProjectHttpAdapterTypes } from './project.http_adapter.types';

export class ProjectHttpAdapter {
	constructor(protected readonly bucket: BucketInfra) {}

	async getImageByKey({ key, env }: ProjectHttpAdapterTypes.GetImageByKeyInput): Promise<ProjectHttpAdapterTypes.GetImageByKeyOutput> {
		const bucketObject = await this.bucket.getItemByKey(key, env);

		return {
			image: mapBucketImageToApp(bucketObject),
		};
	}
}
