import { Env } from '../../..';
import mapProjectInfraToApp from '../common/project_adapter';
import { ProjectResponse } from '../common/project_types';
import listProjectsInfra from './infra/project_list_infra';

async function listProjectsAdapter(env: Env): Promise<ProjectResponse[]> {
	const projectsInfra = await listProjectsInfra(env);

	return projectsInfra.map((project) => mapProjectInfraToApp(project));
}

export default listProjectsAdapter;
