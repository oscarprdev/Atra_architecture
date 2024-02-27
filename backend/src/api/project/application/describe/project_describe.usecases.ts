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

	private async nextRequest(mainImageKey: string, imagesKeys: string, env: Env): Promise<DescribeProjectUsecasesTypes.NextRequestOutput> {
		const imagesKeysArray = imagesKeys.split(',');
		const [mainImageResponse, imagesResponse] = await Promise.all([
			this.ports.getImageByKey({ key: mainImageKey, env }),
			Promise.all(imagesKeysArray.map((imageKey) => this.ports.getImageByKey({ key: imageKey, env }))),
		]);

		return {
			mainImage: mainImageResponse.image,
			images: imagesResponse.map((i) => i.image),
		};
	}

	public async describeProject(id: string, env: Env): Promise<Project> {
		try {
			const response = await this.ports.describeProject({ projectId: id, nextRequest: this.nextRequest.bind(this), env });

			return {
				...response.project,
				mainImage: `${response.project.title}/${response.project.mainImage}`,
				images: response.project.images.map((img) => `${response.project.title}/${img}`),
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
