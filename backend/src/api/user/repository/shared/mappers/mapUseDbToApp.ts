import { UserDb, UserResponse } from '../../../shared/user_types';

export const mapUserDbToApp = (userDb: UserDb): UserResponse => {
	return {
		id: userDb.user_id,
		email: userDb.email,
		name: userDb.name,
		phone: userDb.phone,
		direction: userDb.direction,
		imageKey: userDb.key_image,
		createdAt: userDb.created_at,
	};
};
