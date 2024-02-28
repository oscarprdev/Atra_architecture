import { ImagesUsecases } from '../../../images/application/images.usecases';
import {
	InsertImagePorts,
	InsertProjectPorts,
	ListProjectsTitles,
	ProjectCreatePorts,
	UploadImagePorts,
	UploadImagesPorts,
} from '../../application/create/project_create.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';

export class CreateProjectHttpAdapter implements ProjectCreatePorts {
	constructor(private readonly client: ProjectInfra, private readonly imageUsecases: ImagesUsecases) {}

	async insertProject({ projectBody }: InsertProjectPorts.Input): Promise<InsertProjectPorts.Output> {
		const projectDb = await this.client.createProject(projectBody);

		return {
			project: mapProjectDbToApp(projectDb.project),
		};
	}

	async insertImage({ key, isMain, projectId, env }: InsertImagePorts.Input): Promise<void> {
		await this.client.insertImage({ key, isMain, projectId, env });
	}

	async uploadImage({ file, project, env }: UploadImagePorts.Input): Promise<UploadImagePorts.Output> {
		return await this.imageUsecases.uploadImage({ file, project, env });
	}

	async uploadImages({ files, project, env }: UploadImagesPorts.Input): Promise<UploadImagesPorts.Output> {
		return await this.imageUsecases.uploadImages({ files, project, env });
	}

	async listProjectsTitles({ env }: ListProjectsTitles.Input): Promise<ListProjectsTitles.Output> {
		const projects = await this.client.listProject({ offset: 0, limit: 100, env });

		return {
			titles: projects.projects.map((pr) => pr.title),
		};
	}
}
