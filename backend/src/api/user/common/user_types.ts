import { _Object } from '@aws-sdk/client-s3';

export interface UserResponse {
	email: string;
	name: string;
	phone: number;
	direction: string;
	image: File;
	createdAt: Date;
}

export interface UserDBResponse {
	user_id: string;
	email: string;
	password_hash: string;
	name: string;
	phone: number;
	direction: string;
	key_image: string;
	created_at: string;
}

export interface UserInfraResponse {
	email: string;
	name: string;
	phone: number;
	direction: string;
	image: _Object;
	created_at: string;
}
