import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import listProjectsAdapter from './project_list_adapter';
import { ProjectResponse } from '../common/project_types';
import { ApiResponse } from '../../response';

export async function listProjectsHandler(request: Request, env: Env) {
	try {
		const projectsOutput = await listProjectsAdapter(env);

		const apiResponse: ApiResponse<ProjectResponse[]> = {
			response: 'Project list retrieved successfully',
			data: projectsOutput,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}
