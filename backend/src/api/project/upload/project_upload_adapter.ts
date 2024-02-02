import { Env } from '../../..';
import uploadProjectToInfra from './infra/project_upload_infra';
import { ProjectInput } from './project_upload_types';

async function uploadProjectAdapter(input: ProjectInput, env: Env): Promise<any> {
	return await uploadProjectToInfra(input, env);
}

export default uploadProjectAdapter;
