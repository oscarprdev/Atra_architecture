import { Env } from '../../../..';
import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { Project } from '../../../generated';
import { ProjectDescribePorts } from './project_describe.ports';
import { DescribeProjectUsecasesTypes } from './project_describe.types';

export interface ProjectDescribeUsecases {
	describeProject(id: string, env: Env): Promise<Project>;
}

export class DefaultProjectDescribeUsecases implements ProjectDescribeUsecases {
	constructor(private readonly ports: ProjectDescribePorts) {}

	private async nextRequest(mainImageKey: string, imagesKeys: string): Promise<DescribeProjectUsecasesTypes.NextRequestOutput> {
		return {
			mainImage: mainImageKey,
			images: imagesKeys && imagesKeys.length > 0 ? imagesKeys.split(',') : [],
		};
	}

	public async describeProject(id: string, env: Env): Promise<Project> {
		try {
			const response = await this.ports.describeProject({ projectId: id, nextRequest: this.nextRequest.bind(this), env });

			return {
				...response.project,
				mainImage: response.project.mainImage,
				images: response.project.images,
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error describing project'}`,
				})
			);
		}
	}
}
