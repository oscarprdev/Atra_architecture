export type FormControlField<T> = {
	value: T;
	error: string | null;
};

export interface ProjectFormState {
	title: FormControlField<string>;
	description: FormControlField<string>;
	year: FormControlField<number>;
	mainImage: FormControlField<File | null>;
	images: FormControlField<File[]>;
}

export interface ImagePreviews {
	mainImagePreview: string;
	imagesPreviews: string[] | null;
}
