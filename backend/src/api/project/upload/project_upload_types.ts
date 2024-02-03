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
