import { DescribeProjectPorts, GetImageByKeyPorts, ProjectDescribePorts } from '../../application/describe/project_describe.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { BucketInfra } from '../../infra/bucket_infra';

export class DescribeProjectHttpAdapter implements ProjectDescribePorts {
	constructor(private readonly client: ProjectInfra, private readonly bucket: BucketInfra) {}

	async describeProject({ projectId, nextRequest, env }: DescribeProjectPorts.Input): Promise<DescribeProjectPorts.Output> {
		const { project } = await this.client.describeProject({ projectId, env });

		const { mainImage, images } = await nextRequest(project.main_image, project.images, env);

		return {
			project: {
				id: project.project_id,
				title: project.title,
				description: project.description,
				year: project.year,
				isTop: project.is_top === 1,
				createdAt: project.created_at,
				updatedAt: project.updated_at,
				mainImage,
				images,
			},
		};
	}

	async getImageByKey({ key, env }: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output> {
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
