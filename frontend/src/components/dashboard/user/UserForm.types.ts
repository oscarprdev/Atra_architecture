import type { FormControlField } from '../projects/CreateProjectForm.types';

export interface UserFormState {
	name: FormControlField<string>;
	email: FormControlField<string>;
	phone: FormControlField<number>;
	direction: FormControlField<string>;
}
