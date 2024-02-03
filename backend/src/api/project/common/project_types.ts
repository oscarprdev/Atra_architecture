import { _Object } from '@aws-sdk/client-s3';

export interface ProjectResponse {
	projectId: string;
	title: string;
	description: string;
	year: number;
	isTop: boolean;
	createdAt: Date;
	updatedAt: Date;
	mainImage: File;
	images: File[];
}

export interface ProjectInfraResponse {
	project_id: string;
	title: string;
	description: string;
	year: number;
	is_top: number;
	created_at: string;
	updated_at: string;
	main_image?: _Object;
	images: (_Object | undefined)[];
}
