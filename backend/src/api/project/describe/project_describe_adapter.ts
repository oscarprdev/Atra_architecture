import { Env } from '../../..';
import mapProjectInfraToApp from '../common/project_adapter';
import { ProjectResponse } from '../common/project_types';
import describeProjectInfra from './infra/project_describe_infra';

async function describeProjectAdapter(projectId: string, env: Env): Promise<ProjectResponse> {
	const dbProject = await describeProjectInfra(projectId, env);

	return mapProjectInfraToApp(dbProject);
}

export default describeProjectAdapter;
