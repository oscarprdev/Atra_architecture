import extractErrorInfo from '../../../../utils/extract_from_error_info';
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

			await Promise.all([
				this.ports.deleteItemByKey({ key: project.mainImage, env }),
				...project.images.split(',').map((image) => this.ports.deleteItemByKey({ key: image, env })),
			]);
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