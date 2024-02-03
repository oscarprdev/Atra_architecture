import { Env } from '../../..';
import { UserResponse } from '../common/user_types';
import describeUserInfra from './infra/user_describe_infra';

async function describeUserAdapter(env: Env): Promise<UserResponse> {
	const { name, direction, email, created_at, phone, image } = await describeUserInfra(env);

	return {
		name,
		direction,
		email,
		createdAt: new Date(created_at),
		phone,
		image: image as File,
	};
}

export default describeUserAdapter;
