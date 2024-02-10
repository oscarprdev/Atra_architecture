export type UserLoginInput = {
	email: string;
	password: string;
};

export type UserUpdateInput = {
	email: string;
	name: string;
	phone: number;
	direction: string;
	image: File;
};
