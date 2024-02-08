import { _Object } from '@aws-sdk/client-s3';

export type ProjectDb = {
	project_id: string;
	title: string;
	description: string;
	year: number;
	is_top: number;
	created_at: string;
	updated_at: string;
	images: string;
	main_image: string;
};

export type ProjectResponse = {
	id: string;
	title: string;
	year: number;
	description: string;
	isTop: boolean;
	createdAt: string;
	updatedAt: string;
	mainImage: string;
	images: string;
};
