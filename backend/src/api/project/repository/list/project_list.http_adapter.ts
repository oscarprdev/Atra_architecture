import { HttpAdapter } from '../../../shared/repository/http_adapter';
import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { ProjectInfra } from '../../infra/project_infra';
import { mapProjectDbToApp } from '../shared/mappers/mapProjectDbToApp';
import { ProjectListPorts, ProjectListPortsTypes } from '../../application/list/project_list.ports';

export class ListProjectHttpAdapter extends HttpAdapter implements ProjectListPorts {
	constructor(private readonly client: ProjectInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async listProjects({ env }: ProjectListPortsTypes.Input): Promise<ProjectListPortsTypes.Output> {
		const { projects } = await this.client.listProject({ env });

		return {
			projects: projects.map((project) => mapProjectDbToApp(project)),
		};
	}
}
