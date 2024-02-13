import { Env } from '../../../..';
import { Project, UpdateProjectBody } from '../../../generated';

export namespace UpdateProjectUsecasesTypes {
	export type UpdateProjectInput = {
		updateProjectBody: UpdateProjectBody;
		env: Env;
	};

	export type UpdateProjectOutput = {
		project: Project;
	};
}
