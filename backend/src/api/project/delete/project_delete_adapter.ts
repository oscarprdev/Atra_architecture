import { Env } from '../../..';
import deleteProjectInfra from './infra/project_delete_infra';
import { ProjectDeleteResponse } from './project_delete_types';

async function deleteProjectAdapter(projectId: string, env: Env): Promise<ProjectDeleteResponse> {
	await deleteProjectInfra(projectId, env);

	return {
		id: projectId,
	};
}

export default deleteProjectAdapter;
