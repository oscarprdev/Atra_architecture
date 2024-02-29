import type { FormControlField } from '../projects/CreateProjectForm.types';

interface PasswordState {
	isValid: boolean;
	isLargerEnough?: boolean;
	hasUppercase?: boolean;
	hasNumber?: boolean;
}

export interface AccountFormState {
	oldPassword: FormControlField<string> & { state: PasswordState };
	firstPassword: FormControlField<string> & { state: PasswordState };
	password: FormControlField<string> & { state: PasswordState };
}
