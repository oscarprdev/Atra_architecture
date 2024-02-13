import { z } from 'zod';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { File as ApiFile, CreateUserBody, User } from '../../generated';
import { createUserUsecase } from '../graph';
import { ApiResponse } from '../../shared/models/api_response';

export async function uploadUserHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || 'email@email.com';
		const name = formData.get('name')?.toString() || 'Default name';
		const direction = formData.get('direction')?.toString() || 'Default direction';
		const description = formData.get('description')?.toString() || 'Default description';
		const password = formData.get('password')?.toString() || '1234';
		const phone = Number(formData.get('phone'));
		const image = formData.get('image') as unknown as ApiFile;

		checkInputValidations({ email, name, password, direction, description, phone, image });

		const projectOutput = await createUserUsecase.createUser({
			userBody: { email, name, password, direction, description, phone, image },
			env,
		});

		const apiResponse: ApiResponse<User> = {
			status: 201,
			response: 'User created successfully',
			data: projectOutput.user,
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

function checkInputValidations({ email, name, password, direction, description, phone, image }: CreateUserBody): CreateUserBody {
	const UserPayloadSchema = z.object({
		email: z.string().email(),
		name: z.string(),
		password: z.string(),
		direction: z.string(),
		description: z.string(),
		phone: z.number(),
		image: z.instanceof(File),
	});

	const result = UserPayloadSchema.safeParse({ email, name, password, direction, description, phone, image });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return { email, name, password, direction, description, phone, image };
}
