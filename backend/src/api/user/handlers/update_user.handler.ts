import { z } from 'zod';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { updateUserUsecase } from '../graph';
import { File as ApiFile, UpdateUserBody, User } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function updateUserHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const name = formData.get('name')?.toString();
		const direction = formData.get('direction')?.toString();
		const description = formData.get('description')?.toString();
		const phone = Number(formData.get('phone'));
		const image = formData.get('image') as unknown as ApiFile;

		if (email && name && direction && phone && image && description) {
			const validInput = checkInputValidations({ email, name, direction, description, phone, image });

			const user = await updateUserUsecase.updateUser({
				userBody: {
					email: validInput.email,
					name: validInput.name,
					direction: validInput.direction,
					description: validInput.description,
					phone: validInput.phone,
					image: validInput.image,
				},
				env,
			});

			const apiResponse: ApiResponse<User> = {
				status: 201,
				response: 'User info updated successfully',
				data: user,
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

function checkInputValidations({ email, name, direction, description, phone, image }: UpdateUserBody): UpdateUserBody {
	const UserPayloadSchema = z.object({
		email: z.string().email(),
		name: z.string(),
		direction: z.string(),
		description: z.string(),
		phone: z.number(),
		image: z.instanceof(File),
	});

	const result = UserPayloadSchema.safeParse({ email, name, direction, description, phone, image });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return {
		email,
		name,
		direction,
		description,
		phone,
		image,
	};
}
