import { DescribeProjectPorts, ProjectDescribePorts } from '../../application/describe/project_describe.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectHttpAdapter } from '../shared/project.http_adapter';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';

export class DescribeProjectHttpAdapter extends ProjectHttpAdapter implements ProjectDescribePorts {
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
