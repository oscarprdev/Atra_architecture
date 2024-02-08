import { DescribeProjectPorts, ProjectDescribePorts } from '../../application/describe/project_describe.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { HttpAdapter } from '../../../shared/repository/http_adapter';

export class DescribeProjectHttpAdapter extends HttpAdapter implements ProjectDescribePorts {
	constructor(private readonly client: ProjectInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
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
