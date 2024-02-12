import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { Project } from '../../../generated';
import { ProjectUsecases } from '../../shared/project.usecases';
import { ProjectCreatePorts } from './project_create.ports';
import { ProjectCreateUsecasesTypes } from './project_create.types';

export interface ProjectCreateUsecases {
	createProject(input: ProjectCreateUsecasesTypes.CreateProjectInput): Promise<Project>;
}

export class DefaultProjectCreateUsecases extends ProjectUsecases implements ProjectCreateUsecases {
	constructor(private readonly ports: ProjectCreatePorts) {
		super();
	}

	private async insertImages({ mainImageKey, imagesKeys, projectId, env }: ProjectCreateUsecasesTypes.NextRequestInput): Promise<void> {
		await Promise.all([
			this.ports.insertImage({ key: mainImageKey, isMain: true, projectId, env }),
			...imagesKeys.map((image) => this.ports.insertImage({ key: image, isMain: false, projectId, env })),
		]);
	}

	async createProject({ projectBody, env }: ProjectCreateUsecasesTypes.CreateProjectInput): Promise<Project> {
		try {
			const [{ image }, { images }, projectResponse] = await Promise.all([
				this.ports.uploadImage({ file: projectBody.mainImage, project: projectBody.title, env }),
				this.ports.uploadImages({ files: projectBody.images, project: projectBody.title, env }),
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
				mainImageKey: image.Key,
				imagesKeys: images.map((img) => img.Key),
				projectId: projectResponse.project.id,
				env,
			});

			return {
				...projectResponse.project,
				mainImage: image,
				images,
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
