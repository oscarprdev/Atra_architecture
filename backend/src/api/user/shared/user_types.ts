export interface UserResponse {
	id: string;
	email: string;
	name: string;
	phone: number;
	direction: string;
	description: string;
	image: string;
	createdAt: string;
}

export interface UserDb {
	user_id: string;
	email: string;
	password_hash: string;
	name: string;
	phone: number;
	direction: string;
	description: string;
	key_image: string;
	created_at: string;
}
