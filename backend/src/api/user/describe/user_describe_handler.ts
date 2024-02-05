import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import describeUserAdapter from './user_describe_adapter';
import { ApiResponse } from '../../response';
import { UserResponse } from '../common/user_types';

export async function describeUserHandler(request: Request, env: Env) {
	try {
		const userOutput = await describeUserAdapter(env);

		const apiResponse: ApiResponse<UserResponse> = {
			response: 'User provided successfully',
			data: userOutput,
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
