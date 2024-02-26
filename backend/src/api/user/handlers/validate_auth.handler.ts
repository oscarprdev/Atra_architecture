import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { validateAuthUsecase } from '../graph';
import { ApiResponse } from '../../shared/models/api_response';

export async function validateAuthHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		if (bodyParsed.jwt) {
			const response = await validateAuthUsecase.validateAuth({ token: bodyParsed.jwt, env });

			const apiResponse: ApiResponse<string> = {
				status: 200,
				response: 'Aunthentication successfully',
				data: response.token,
			};

			return new Response(JSON.stringify(apiResponse), {
				status: 201,
			});
		}

		throw new Error(JSON.stringify({ status: 400, message: 'Request body not valid' }));
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}
