import { _Object } from '@aws-sdk/client-s3';

export interface InsertUserToDbInput {
	email: string;
	name: string;
	password: string;
	phone: number;
	direction: string;
	imageKey: string;
	salt: string;
}

export interface UploadUserInfraResponse {
	user_id: string;
	email: string;
	name: string;
	phone: number;
	direction: string;
	image?: _Object;
	created_at: string;
}
