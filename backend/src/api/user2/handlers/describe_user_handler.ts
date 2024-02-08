import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { ApiResponse } from '../../response';
import { describeUserUsecase } from '../graph';
import { User } from '../../generated';

export async function describeUserHandler(request: Request, env: Env) {
	try {
		const userOutput = await describeUserUsecase.describeUser({ env });

		const apiResponse: ApiResponse<User> = {
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
