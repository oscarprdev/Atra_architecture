import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { UserUpdateInput } from './user_update_types';
import updateUserAdapter from './user_update_adapter';

export async function updateUserHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const name = formData.get('name')?.toString();
		const direction = formData.get('direction')?.toString();
		const phone = Number(formData.get('phone'));
		const image = formData.get('image') as File;

		if (email && name && direction && phone && image) {
			const validInput = checkInputValidations({ email, name, direction, phone, image });

			const projectOutput = await updateUserAdapter(validInput, env);

			return new Response(JSON.stringify(projectOutput), {
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

function checkInputValidations({ email, name, direction, phone, image }: UserUpdateInput): UserUpdateInput {
	const UserPayloadSchema = z.object({
		email: z.string().email(),
		name: z.string(),
		direction: z.string(),
		phone: z.number(),
		image: z.instanceof(File),
	});

	const result = UserPayloadSchema.safeParse({ email, name, direction, phone, image });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
