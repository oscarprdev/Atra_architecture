import { Env } from '../../..';
import { UserResponse } from '../common/user_types';
import uploadUserInfra from './infra/user_upload_infra';
import { User } from './user_upload_types';

async function uploadUserAdapter(user: User, env: Env): Promise<UserResponse> {
	const { name, direction, email, created_at, phone, image } = await uploadUserInfra(user, env);

	return {
		name,
		direction,
		email,
		createdAt: new Date(created_at),
		phone,
		image: image as File,
	};
}

export default uploadUserAdapter;
