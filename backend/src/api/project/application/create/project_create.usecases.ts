import { Env } from '../../../..';
import extractErrorInfo from '../../../../utils/extract_from_error_info';
import { File, Project } from '../../../generated';
import { ProjectCreatePorts } from './project_create.ports';
import { ProjectCreateUsecasesTypes } from './project_create.types';

export interface ProjectCreateUsecases {
	createProject(input: ProjectCreateUsecasesTypes.CreateProjectInput): Promise<Project>;
}

export class DefaultProjectCreateUsecases implements ProjectCreateUsecases {
	constructor(private readonly ports: ProjectCreatePorts) {}

	private generateImageKey(project: string) {
		const imageId = crypto.randomUUID().toString();
		const projectName = project.replaceAll(' ', '_');

		return `${projectName}/${imageId}`;
	}

	private async uploadMainImage(mainImage: File, project: string, env: Env) {
		const key = this.generateImageKey(project);
		const type = mainImage.Type || 'image/jpg';

		return await this.ports.uploadImage({ file: mainImage, key, type, env });
	}

	private async uploadImages(images: File[], project: string, env: Env) {
		const key = this.generateImageKey(project);

		return await Promise.all(images.map((image) => this.ports.uploadImage({ file: image, key, type: image.Type || 'image/jpg', env })));
	}

	private async insertImages({ mainImageKey, imagesKeys, projectId, env }: ProjectCreateUsecasesTypes.NextRequestInput): Promise<void> {
		await Promise.all([
			this.ports.insertImage({ key: mainImageKey, isMain: true, projectId, env }),
			...imagesKeys.map((image) => this.ports.insertImage({ key: image, isMain: false, projectId, env })),
		]);
	}

	async createProject({ projectBody, env }: ProjectCreateUsecasesTypes.CreateProjectInput): Promise<Project> {
		try {
			const [mainImageUploaded, imagesUploaded, projectResponse] = await Promise.all([
				this.uploadMainImage(projectBody.mainImage, projectBody.title, env),
				this.uploadImages(projectBody.images, projectBody.title, env),
				this.ports.insertProject({
					projectBody: {
						projectId: crypto.randomUUID().toString(),
						title: projectBody.title,
						year: projectBody.year,
						description: projectBody.description,
						isTop: projectBody.isTop,
						env,
					},
				}),
			]);

			await this.insertImages({
				mainImageKey: mainImageUploaded.image.Key,
				imagesKeys: imagesUploaded.map((outout) => outout.image.Key),
				projectId: projectResponse.project.id,
				env,
			});

			return {
				...projectResponse.project,
				mainImage: mainImageUploaded.image,
				images: imagesUploaded.map((outout) => outout.image),
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error creating project'}`,
				})
			);
		}
	}
}
