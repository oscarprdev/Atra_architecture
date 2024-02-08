import { Env } from '../../../..';
import { ProjectDb } from '../../../common/models/project_db';

export namespace DeleteProjectInfra {
	export type Input = {
		projectId: string;
		env: Env;
	};

	export type Output = {
		project: ProjectDb;
	};
}
