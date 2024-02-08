import { DeleteItemByKeyPortsTypes, DeleteProjectPorts, DeleteProjectPortsTypes } from '../../application/delete/project_delete.ports';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../common/mapProjectDbToApp';

export class DeleteProjectHttpAdapter implements DeleteProjectPorts {
	constructor(private readonly client: ProjectInfra, private readonly bucket: BucketInfra) {}

	async deleteProject({ projectId, env }: DeleteProjectPortsTypes.Input): Promise<DeleteProjectPortsTypes.Output> {
		const response = await this.client.deleteProject({ projectId, env });

		return {
			project: mapProjectDbToApp(response.project),
		};
	}

	async deleteItemByKey({ key, env }: DeleteItemByKeyPortsTypes.Input): Promise<void> {
		await this.bucket.deleteItemByKey(key, env);
	}
}
