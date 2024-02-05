import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { User } from './user_upload_types';
import uploadUserAdapter from './user_upload_adapter';
import { ApiResponse } from '../../response';
import { UserResponse } from '../common/user_types';

export async function uploadUserHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || 'email@email.com';
		const name = formData.get('name')?.toString() || 'Default name';
		const direction = formData.get('direction')?.toString() || 'Default direction';
		const password = formData.get('password')?.toString() || '1234';
		const phone = Number(formData.get('phone'));
		const image = formData.get('image') as File;

		const validInput = checkInputValidations({ email, name, password, direction, phone, image });

		const projectOutput = await uploadUserAdapter(validInput, env);

		const apiResponse: ApiResponse<UserResponse> = {
			response: 'User uploaded successfully',
			data: projectOutput,
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

function checkInputValidations({ email, name, password, direction, phone, image }: User): User {
	const UserPayloadSchema = z.object({
		email: z.string().email(),
		name: z.string(),
		password: z.string(),
		direction: z.string(),
		phone: z.number(),
		image: z.instanceof(File),
	});

	const result = UserPayloadSchema.safeParse({ email, name, password, direction, phone, image });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
