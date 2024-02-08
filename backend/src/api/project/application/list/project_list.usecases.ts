import { Project } from '../../../generated';
import { ProjectListPorts } from './project_list.ports';
import { ProjectListUsecasesTypes } from './project_list.types';

export interface ProjectListUsecases {
	listProjects(input: ProjectListUsecasesTypes.Input): Promise<Project[]>;
}

export class DefaultProjectListUsecases implements ProjectListUsecases {
	constructor(private readonly ports: ProjectListPorts) {}

	async listProjects({ env }: ProjectListUsecasesTypes.Input): Promise<Project[]> {
		const { projects } = await this.ports.listProjects({ env });

		return await Promise.all(
			projects.map(async (project) => {
				const { image } = await this.ports.getImageByKey({ key: project.mainImage, env });
				const images = await Promise.all(project.images.split(',').map((image) => this.ports.getImageByKey({ key: image, env })));

				return {
					...project,
					mainImage: image,
					images: images.map((img) => img.image),
				};
			})
		);
	}
}
