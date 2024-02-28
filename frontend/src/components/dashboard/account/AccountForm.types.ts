import type { FormControlField } from '../projects/CreateProjectForm.types';

export interface AccountFormState {
	oldPassword: FormControlField<string>;
	firstPassword: FormControlField<string>;
	password: FormControlField<string>;
}
