import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { UserPasswordUpdateInput } from './user_update_password_types';
import updatePasswordUserAdapter from './user_update_password_adapter';
import { ApiResponse } from '../../response';

export async function updatePasswordUserHandler(request: Request, env: Env) {
	try {
		const body = await request.text();
		const bodyParsed = JSON.parse(body);

		if (bodyParsed.oldPassword && bodyParsed.newPassword) {
			const validInput = checkInputValidations({ oldPassword: bodyParsed.oldPassword, newPassword: bodyParsed.newPassword });

			await updatePasswordUserAdapter(validInput, env);

			const apiResponse: ApiResponse<null> = {
				response: 'Password updated successfully',
				data: null,
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

function checkInputValidations({ oldPassword, newPassword }: UserPasswordUpdateInput): UserPasswordUpdateInput {
	const UserPayloadSchema = z.object({
		oldPassword: z.string(),
		newPassword: z.string(),
	});

	const result = UserPayloadSchema.safeParse({ oldPassword, newPassword });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}