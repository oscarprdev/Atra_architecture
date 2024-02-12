import { ImagesUsecases } from '../../../images/application/images.usecases';
import { DeleteImageByKeyPortsTypes, DeleteProjectPorts, DeleteProjectPortsTypes } from '../../application/delete/project_delete.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';

export class DeleteProjectHttpAdapter implements DeleteProjectPorts {
	constructor(private readonly client: ProjectInfra, private readonly imageUsecases: ImagesUsecases) {}

	async deleteProject({ projectId, env }: DeleteProjectPortsTypes.Input): Promise<DeleteProjectPortsTypes.Output> {
		const response = await this.client.deleteProject({ projectId, env });

		return {
			project: mapProjectDbToApp(response.project),
		};
	}

	async deleteImageByKey({ key, env }: DeleteImageByKeyPortsTypes.Input): Promise<void> {
		await this.imageUsecases.deleteImageByKey({ key, env });
	}
}
