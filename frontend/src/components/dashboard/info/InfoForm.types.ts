import type { FormControlField } from '../projects/CreateProjectForm.types';

export interface InfoFormState {
	description: FormControlField<string>;
	image: FormControlField<File | null>;
}
