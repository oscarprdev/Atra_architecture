import { DescribeProjectPorts, GetImageByKeyPorts, ProjectDescribePorts } from '../../application/describe/project_describe.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { ImagesUsecases } from '../../../images/application/images.usecases';

export class DescribeProjectHttpAdapter implements ProjectDescribePorts {
	constructor(private readonly client: ProjectInfra, protected readonly imagesUsecases: ImagesUsecases) {}

	async getImageByKey({ key, env }: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output> {
		return await this.imagesUsecases.getImageByKey({ key, env });
	}

	async describeProject({ projectId, nextRequest, env }: DescribeProjectPorts.Input): Promise<DescribeProjectPorts.Output> {
		const { project } = await this.client.describeProject({ projectId, env });

		const { mainImage, images } = await nextRequest(project.main_image, project.images, env);

		return {
			project: {
				...mapProjectDbToApp(project),
				mainImage,
				images,
			},
		};
	}
}
