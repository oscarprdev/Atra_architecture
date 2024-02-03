import { Env } from '../../..';
import mapProjectInfraToApp from '../common/project_adapter';
import { ProjectResponse } from '../common/project_types';
import uploadProjectToInfra from './infra/project_upload_infra';
import { ProjectInput } from './project_upload_types';

async function uploadProjectAdapter(input: ProjectInput, env: Env): Promise<ProjectResponse> {
	const project = await uploadProjectToInfra(input, env);

	return mapProjectInfraToApp(project);
}

export default uploadProjectAdapter;
