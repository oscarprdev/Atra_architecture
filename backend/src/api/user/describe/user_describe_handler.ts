import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import describeUserAdapter from './user_describe_adapter';

export async function describeUserHandler(request: Request, env: Env) {
	try {
		const userOutput = await describeUserAdapter(env);

		return new Response(JSON.stringify(userOutput), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}
