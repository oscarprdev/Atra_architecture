import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { loginUserUsecase } from '../graph';
import { LoginUserBody } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function userLoginHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		if (bodyParsed.email && bodyParsed.password) {
			const validInput = checkInputValidations({ email: bodyParsed.email, password: bodyParsed.password });

			const response = await loginUserUsecase.loginUser({ password: validInput.password, email: validInput.email, env });

			const apiResponse: ApiResponse<string> = {
				status: 201,
				response: 'User logged successfully',
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

function checkInputValidations({ email, password }: LoginUserBody): LoginUserBody {
	const UserPayloadSchema = z.object({
		email: z.string().email(),
		password: z.string(),
	});

	const result = UserPayloadSchema.safeParse({ email, password });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
