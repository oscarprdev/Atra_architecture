import convertToBoolean from '../../shared/utils/convert_to_bool';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { projectUpdateUsecase } from '../graph';
import { Project } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function updateProjectIsTopHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		const id = bodyParsed.id;
		const isTop = convertToBoolean(bodyParsed.isTop);

		if (!id) {
			throw new Error(JSON.stringify({ status: 400, message: 'Body not valid' }));
		}

		const projectOutput = await projectUpdateUsecase.updateIsTop({ id, isTop, env });

		const apiResponse: ApiResponse<Project> = {
			status: 201,
			response: 'Project isTop field updated successfully',
			data: projectOutput.project,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 201,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}
