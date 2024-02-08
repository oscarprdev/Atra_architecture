import { GetImageByKeyPorts, ProjectListPorts, ProjectListPortsTypes } from '../../application/list/project_list.ports';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../common/mapProjectDbToApp';

export class ListProjectHttpAdapter implements ProjectListPorts {
	constructor(private readonly client: ProjectInfra, private readonly bucket: BucketInfra) {}

	async listProjects({ env }: ProjectListPortsTypes.Input): Promise<ProjectListPortsTypes.Output> {
		const { projects } = await this.client.listProject({ env });

		return {
			projects: projects.map((project) => mapProjectDbToApp(project)),
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
