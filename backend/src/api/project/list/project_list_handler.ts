import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import listProjectsAdapter from './project_list_adapter';

export async function listProjectsHandler(request: Request, env: Env) {
	try {
		const projectsOutput = await listProjectsAdapter(env);

		return new Response(JSON.stringify(projectsOutput), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}
