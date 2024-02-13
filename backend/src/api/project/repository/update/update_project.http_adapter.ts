import { ImagesUsecases } from '../../../images/application/images.usecases';
import {
	InsertImageOnDbPorts,
	RemoveImagesFromBucketPorts,
	RemoveImagesFromDbPorts,
	SelectImagesByProjectFromBucketPorts,
	UpdateProjectPorts,
	UploadImagesOnBucketPorts,
} from '../../application/update/update_project.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';

export class UpdateProjectHttpAdapter implements UpdateProjectPorts {
	constructor(private readonly client: ProjectInfra, private readonly imageUsecases: ImagesUsecases) {}

	async selectImagesByProjectFromBucket({
		project,
		env,
	}: SelectImagesByProjectFromBucketPorts.Input): Promise<SelectImagesByProjectFromBucketPorts.Output> {
		return await this.imageUsecases.getImagesByEntity({ entity: project, env });
	}

	async removeImagesFromBucket({ images, env }: RemoveImagesFromBucketPorts.Input): Promise<void> {
		await Promise.all(images.map((img) => this.imageUsecases.deleteImageByKey({ key: img.Key, env })));
	}

	async uploadImagesOnBucket({ images, project, env }: UploadImagesOnBucketPorts.Input): Promise<UploadImagesOnBucketPorts.Output> {
		const response = await this.imageUsecases.uploadImages({ files: images, project, env });

		return {
			images: response.images,
		};
	}

	async removeImagesFromDb({ imageKeys, env }: RemoveImagesFromDbPorts.Input): Promise<void> {
		await Promise.all(imageKeys.map((imgKey) => this.client.deleteImage({ imageKey: imgKey, env })));
	}

	async insertImageOnDb({ imageKey, projectId, isMain, env }: InsertImageOnDbPorts.Input): Promise<void> {
		await this.client.insertImage({ isMain, projectId, key: imageKey, env });
	}

	async updateProject({
		projectBody: { description, title, year, isTop, projectId },
		env,
	}: UpdateProjectPorts.Input): Promise<UpdateProjectPorts.Output> {
		const { project } = await this.client.updateProject({ projectId, title, description, year, isTop, env });

		return {
			project: mapProjectDbToApp(project),
		};
	}
}
