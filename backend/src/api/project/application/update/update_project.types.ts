import { Env } from '../../../..';
import { Project, UpdateProjectBody } from '../../../generated';
import { ProjectResponse } from '../../shared/project_types';

export namespace UpdateProjectUsecasesTypes {
	export type UpdateProjectInput = {
		updateProjectBody: UpdateProjectBody;
		env: Env;
	};

	export type UpdateProjectOutput = {
		project: Project;
	};

	export type UpdateIsTopInput = {
		id: string;
		isTop: boolean;
		env: Env;
	};

	export type UpdateIsTopOutput = {
		project: Project
	};
}
