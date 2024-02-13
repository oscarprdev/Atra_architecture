import { Env } from '../../../..';
import { ProjectDb } from '../../shared/project_types';

export namespace ListProjectInfra {
	export type Input = {
		search?: string;
		offset: number;
		limit: number;
		env: Env;
	};

	export type Output = {
		projects: ProjectDb[];
	};
}
