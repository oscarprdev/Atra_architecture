import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { projectListUsecase } from '../graph';
import { Project } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function listProjectsHandler(request: Request, env: Env) {
	try {
		const projectsOutput = await projectListUsecase.listProjects({ env });

		const apiResponse: ApiResponse<Project[]> = {
			status: 200,
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
