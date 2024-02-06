import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { ApiResponse } from '../../response';
import { UserLoginInput } from './user_login_types';
import userLoginUsecase from './user_login_usecase';

export async function userLoginHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		if (bodyParsed.email && bodyParsed.password) {
			const validInput = checkInputValidations({ email: bodyParsed.email, password: bodyParsed.password });

			const jwt = await userLoginUsecase(validInput, env);

			const apiResponse: ApiResponse<string> = {
				response: 'User logged successfully',
				data: jwt,
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

function checkInputValidations({ email, password }: UserLoginInput): UserLoginInput {
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
