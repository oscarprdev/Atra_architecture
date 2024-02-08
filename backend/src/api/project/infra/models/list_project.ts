import { Env } from '../../../..';
import { ProjectDb } from '../../shared/project_types';

export namespace ListProjectInfra {
	export type Input = {
		env: Env;
	};

	export type Output = {
		projects: ProjectDb[];
	};
}
