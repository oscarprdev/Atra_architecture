import { Env } from '../../../..';
import { ProjectDb } from '../../shared/project_types';

export namespace ListProjectInfra {
	export type Input = {
		offset: number;
		limit: number;
		env: Env;
	};

	export type Output = {
		projects: ProjectDb[];
	};
}
