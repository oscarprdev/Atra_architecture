import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { Project } from '../../../generated';
import { ProjectListPorts } from './project_list.ports';
import { ProjectListUsecasesTypes } from './project_list.types';

export const LIMIT = 6;

export interface ProjectListUsecases {
	listProjects(input: ProjectListUsecasesTypes.Input): Promise<Project[]>;
}

export class DefaultProjectListUsecases implements ProjectListUsecases {
	constructor(private readonly ports: ProjectListPorts) {}

	private calculateOffset = (page: number) => {
		return LIMIT * (page - 1);
	};

	async listProjects({ search, page, env }: ProjectListUsecasesTypes.Input): Promise<Project[]> {
		try {
			const offset = this.calculateOffset(page);
			const { projects } = await this.ports.listProjects({ search, offset, limit: LIMIT, env });

			return await Promise.all(
				projects.map(async (project) => {
					const { image } = await this.ports.getImageByKey({ key: project.mainImage, env });
					const images = await Promise.all(project.images.split(',').map((image) => this.ports.getImageByKey({ key: image, env })));

					const title = project.title.replaceAll(' ', '_');

					return {
						...project,
						mainImage: `${title}/${image.name}`,
						images: images.map((img) => `${title}/${img.image.name}`),
					};
				})
			);
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error listing project'}`,
				})
			);
		}
	}
}
