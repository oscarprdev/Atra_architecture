import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { DeleteProjectPorts } from './project_delete.ports';
import { ProjectDeleteUsecasesTypes } from './project_delete.types';

export interface ProjectDeleteUsecases {
	deleteProject(input: ProjectDeleteUsecasesTypes.Input): Promise<void>;
}

export class DefaultProjectDeleteUsecases implements ProjectDeleteUsecases {
	constructor(private readonly ports: DeleteProjectPorts) {}

	async deleteProject({ projectId, env }: ProjectDeleteUsecasesTypes.Input): Promise<void> {
		try {
			const { project } = await this.ports.deleteProject({ projectId, env });

			if (project.mainImage) {
				await this.ports.deleteImageByKey({ key: project.mainImage, env });
			}

			await Promise.all([...project.images.split(',').map((image) => this.ports.deleteImageByKey({ key: image, env }))]);
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error deleting project'}`,
				})
			);
		}
	}
}
