import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { GetImageByKeyPorts, ProjectListPorts, ProjectListPortsTypes } from '../../application/list/project_list.ports';
import { ImagesUsecases } from '../../../images/application/images.usecases';

export class ListProjectHttpAdapter implements ProjectListPorts {
	constructor(private readonly client: ProjectInfra, protected readonly imagesUsecases: ImagesUsecases) {}

	async getImageByKey({ key, env }: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output> {
		return await this.imagesUsecases.getImageByKey({ key, env });
	}

	async listProjects({ offset, limit, env }: ProjectListPortsTypes.Input): Promise<ProjectListPortsTypes.Output> {
		const { projects } = await this.client.listProject({ offset, limit, env });

		return {
			projects: projects.map((project) => mapProjectDbToApp(project)),
		};
	}
}
