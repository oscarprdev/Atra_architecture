import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { describeUserUsecase } from '../graph';
import { User } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function describeUserHandler(request: Request, env: Env) {
	try {
		const userOutput = await describeUserUsecase.describeUser({ env });

		const apiResponse: ApiResponse<User> = {
			status: 200,
			response: 'User provided successfully',
			data: userOutput.user,
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
