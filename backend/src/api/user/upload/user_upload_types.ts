export interface User {
	email: string;
	name: string;
	password: string;
	phone: number;
	direction: string;
	image: File;
}

export interface UserResponse {
	email: string;
	name: string;
	phone: number;
	direction: string;
	image: File;
	createdAt: Date;
}
