import { _Object } from '@aws-sdk/client-s3';
import { Value } from '@libsql/client/web';

export interface UploadProjectToInfraInput {
	title: string;
	year: number;
	description: string;
	isTop: boolean;
	mainImage: File;
	images: File[];
}

export interface InsertProjectToDbInput {
	title: string;
	year: number;
	description: string;
	isTop: boolean;
}

export interface InsertImagesToDbInput {
	key?: string;
	isMain: boolean;
	projectId: Value;
}

export interface InsertRelationProjectImageInput {
	projectId: Value;
	imageId: string;
}

export interface InsertProjectToDbOutput {
	project_id: string;
	title: string;
	description: string;
	year: number;
	is_top: number;
	created_at: string;
	updated_at: string;
}

export interface UploadProjectToInfraOutput {
	project_id: string;
	title: string;
	description: string;
	year: number;
	is_top: number;
	created_at: string;
	updated_at: string;
	mainImage?: _Object;
	images: (_Object | undefined)[];
}
