import { Env } from '../../../..';
import { ProjectDb } from '../../shared/project_types';

export namespace DeleteProjectInfra {
	export type Input = {
		projectId: string;
		env: Env;
	};

	export type Output = {
		project: ProjectDb;
	};
}
