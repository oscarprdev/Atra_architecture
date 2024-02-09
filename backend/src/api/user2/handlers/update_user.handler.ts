import { z } from 'zod';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { ApiResponse } from '../../response';
import { updateUserUsecase } from '../graph';
import { File as ApiFile, UpdateUserBody, User } from '../../generated';

export async function updateUserHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const name = formData.get('name')?.toString();
		const direction = formData.get('direction')?.toString();
		const phone = Number(formData.get('phone'));
		const image = formData.get('image') as unknown as ApiFile;

		if (email && name && direction && phone && image) {
			const validInput = checkInputValidations({ email, name, direction, phone, image });

			const user = await updateUserUsecase.updateUser({
				email: validInput.email,
				name: validInput.name,
				direction: validInput.direction,
				phone: validInput.phone,
				image: validInput.image,
				env,
			});

			const apiResponse: ApiResponse<User> = {
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

function checkInputValidations({ email, name, direction, phone, image }: UpdateUserBody): UpdateUserBody {
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

	return {
		email,
		name,
		direction,
		phone,
		image,
	};
}
