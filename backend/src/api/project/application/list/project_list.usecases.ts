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

	async listProjects({ search, date, isTop, year, page, env }: ProjectListUsecasesTypes.Input): Promise<Project[]> {
		try {
			const offset = this.calculateOffset(page);
			const { projects } = await this.ports.listProjects({ search, date, isTop, year, offset, limit: LIMIT, env });

			return projects.map((project) => {
				return {
					...project,
					images: project.images && project.images.length > 0 ? project.images.split(',') : [],
				};
			});
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
