import { DeleteItemByKeyPortsTypes, DeleteProjectPorts, DeleteProjectPortsTypes } from '../../application/delete/project_delete.ports';
import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { HttpAdapter } from '../../../shared/repository/http_adapter';

export class DeleteProjectHttpAdapter extends HttpAdapter implements DeleteProjectPorts {
	constructor(private readonly client: ProjectInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async deleteProject({ projectId, env }: DeleteProjectPortsTypes.Input): Promise<DeleteProjectPortsTypes.Output> {
		const response = await this.client.deleteProject({ projectId, env });

		return {
			project: mapProjectDbToApp(response.project),
		};
	}

	async deleteItemByKey({ key, env }: DeleteItemByKeyPortsTypes.Input): Promise<void> {
		await this.deleteItemByKey({ key, env });
	}
}
