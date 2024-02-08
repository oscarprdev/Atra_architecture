import { InsertImagePorts, InsertProjectPorts, ProjectCreatePorts, UploadImagePorts } from '../../application/create/project_create.ports';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';

export class CreateProjectHttpAdapter implements ProjectCreatePorts {
	constructor(private readonly client: ProjectInfra, private readonly bucket: BucketInfra) {}

	async insertProject({ projectBody }: InsertProjectPorts.Input): Promise<InsertProjectPorts.Output> {
		const {
			project: { project_id, title, year, description, is_top, created_at, updated_at },
		} = await this.client.createProject(projectBody);

		return {
			project: {
				id: project_id,
				title,
				year,
				description,
				isTop: is_top === 1,
				createdAt: created_at,
				updatedAt: updated_at,
			},
		};
	}

	async insertImage({ key, isMain, projectId, env }: InsertImagePorts.Input): Promise<void> {
		await this.client.insertImage({ key, isMain, projectId, env });
	}

	async uploadImage({ file, key, type, env }: UploadImagePorts.Input): Promise<UploadImagePorts.Output> {
		const fileBuffer = await (file as unknown as File).arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		const imagedb = await this.bucket.uploadImage(uint8Array, key, type, env);

		if (imagedb && imagedb.Key && imagedb.ETag && imagedb.LastModified && imagedb.Size && imagedb.StorageClass) {
			return {
				image: {
					Key: imagedb.Key,
					LastModified: imagedb.LastModified.toString(),
					ETag: imagedb.ETag,
					Size: imagedb.Size,
					StorageClass: imagedb.StorageClass,
				},
			};
		} else {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: 'Error uploading image',
				})
			);
		}
	}
}
