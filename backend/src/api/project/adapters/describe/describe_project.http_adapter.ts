import { DescribeProjectPorts, ProjectDescribePorts } from '../../application/describe/project_describe.ports';
import { ProjectInfra } from '../../infra/project_infra';
import { BucketInfra } from '../../infra/bucket_infra';
import { ProjectHttpAdapter } from '../shared/project.http_adapter';

export class DescribeProjectHttpAdapter extends ProjectHttpAdapter implements ProjectDescribePorts {
	constructor(private readonly client: ProjectInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async describeProject({ projectId, nextRequest, env }: DescribeProjectPorts.Input): Promise<DescribeProjectPorts.Output> {
		const { project } = await this.client.describeProject({ projectId, env });

		const { mainImage, images } = await nextRequest(project.main_image, project.images, env);

		return {
			project: {
				id: project.project_id,
				title: project.title,
				description: project.description,
				year: project.year,
				isTop: project.is_top === 1,
				createdAt: project.created_at,
				updatedAt: project.updated_at,
				mainImage,
				images,
			},
		};
	}
}
