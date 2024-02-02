export interface ProjectInput {
	title: string;
	year: number;
	description: string;
	isTop: boolean;
	mainImage: File;
	images: File[];
}

export interface UploadProjectOutput {
	id: string;
	title: string;
	year: number;
	description: string;
	isTop: boolean;
	mainImage: File;
	images: File[];
	updatedAt: Date;
}

export interface UploadProjectAdapterOutput {
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
