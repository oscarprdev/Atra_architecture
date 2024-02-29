import { z } from 'zod';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { updatePasswordUsecase } from '../graph';
import { ApiResponse } from '../../shared/models/api_response';
import { ValidateUserPasswordBody } from '../../generated';

export async function validateasswordUserHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		if (bodyParsed.oldPassword) {
			const { oldPassword } = checkInputValidations({ oldPassword: bodyParsed.oldPassword });

			const isValidated = await updatePasswordUsecase.validatePassword({ oldPassword, env });

			const apiResponse: ApiResponse<boolean> = {
				status: 200,
				response: 'Password is successfully validated',
				data: isValidated,
			};

			return new Response(JSON.stringify(apiResponse), {
				status: 200,
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

function checkInputValidations({ oldPassword }: ValidateUserPasswordBody) {
	const UserPayloadSchema = z.object({
		oldPassword: z.string(),
	});

	const result = UserPayloadSchema.safeParse({ oldPassword });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
