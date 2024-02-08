import { InsertImagePorts, InsertProjectPorts, ProjectCreatePorts, UploadImagePorts } from '../../application/create/project_create.ports';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapBucketImageToApp } from '../shared/mappers/mapBucketImagetoApp';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';

export class CreateProjectHttpAdapter implements ProjectCreatePorts {
	constructor(private readonly client: ProjectInfra, private readonly bucket: BucketInfra) {}

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
		const fileBuffer = await (file as unknown as File).arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		const imagedb = await this.bucket.uploadImage(uint8Array, key, type, env);

		return {
			image: mapBucketImageToApp(imagedb),
		};
	}
}
