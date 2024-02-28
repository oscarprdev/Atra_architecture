import { Env } from '../../../..';
import { Project } from '../../../generated';
import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
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

	private async checkProjectWithSameTitle(env: Env, projectBodyTitle: string) {
		const { titles } = await this.ports.listProjectsTitles({ env });

		const isTitleAlreadyCreated = titles.some((title) => title === projectBodyTitle);

		if (isTitleAlreadyCreated) {
			throw new Error('Title already created');
		}
	}

	async createProject({ projectBody, env }: ProjectCreateUsecasesTypes.CreateProjectInput): Promise<Project> {
		try {
			await this.checkProjectWithSameTitle(env, projectBody.title);

			const [{ image }, { images }, projectResponse] = await Promise.all([
				this.ports.uploadImage({ file: projectBody.mainImage as File, project: projectBody.title, env }),
				this.ports.uploadImages({ files: projectBody.images as File[], project: projectBody.title, env }),
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

			const mainImageKey = `${projectResponse.project.title.replaceAll(' ', '_')}/${image.name}`;
			const imagesKeys = images.map((img) => `${projectResponse.project.title.replaceAll(' ', '_')}/${img.name}`);

			await this.insertImages({
				mainImageKey,
				imagesKeys,
				projectId: projectResponse.project.id,
				env,
			});

			return {
				...projectResponse.project,
				mainImage: mainImageKey,
				images: imagesKeys,
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
