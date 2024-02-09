import { InsertImagePorts, InsertProjectPorts, ProjectCreatePorts, UploadImagePorts } from '../../application/create/project_create.ports';
import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { HttpAdapter } from '../../../shared/repository/http_adapter';

export class CreateProjectHttpAdapter extends HttpAdapter implements ProjectCreatePorts {
	constructor(private readonly client: ProjectInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async insertProject({ projectBody }: InsertProjectPorts.Input): Promise<InsertProjectPorts.Output> {
		const projectDb = await this.client.createProject(projectBody);

		return {
			project: mapProjectDbToApp(projectDb.project),
		};
	}

	async insertImage({ key, isMain, projectId, env }: InsertImagePorts.Input): Promise<void> {
		await this.client.insertImage({ key, isMain, projectId, env });
	}

	async uploadImage({ file, key, type, env }: UploadImagePorts.Input): Promise<UploadImagePorts.Output> {
		return await this.uploadImageToBucket({ file, key, type, env });
	}
}
