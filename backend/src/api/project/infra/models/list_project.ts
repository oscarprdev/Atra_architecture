import { Env } from '../../../..';
import { ProjectDb } from '../../../common/models/project_db';

export namespace ListProjectInfra {
	export type Input = {
		env: Env;
	};

	export type Output = {
		projects: ProjectDb[];
	};
}
