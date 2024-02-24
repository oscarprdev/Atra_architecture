export type FormControlField<T> = {
	value: T;
	error: string | null;
};

export interface CreateProjectFormControl {
	name: FormControlField<string>;
	description: FormControlField<string>;
	year: FormControlField<number>;
	mainImage: FormControlField<File | null>;
	images: FormControlField<File[]>;
}
