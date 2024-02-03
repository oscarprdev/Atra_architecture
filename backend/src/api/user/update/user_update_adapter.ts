import { Env } from '../../..';
import updateUserInfra from './infra/user_update_infra';
import { UserUpdateInput } from './user_update_types';

async function updateUserAdapter(input: UserUpdateInput, env: Env) {
	const { name, direction, email, created_at, phone, image } = await updateUserInfra(input, env);

	return {
		name,
		direction,
		email,
		createdAt: new Date(created_at),
		phone,
		image: image as File,
	};
}

export default updateUserAdapter;
