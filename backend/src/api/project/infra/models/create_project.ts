import { Env } from '../../../..';
import { ProjectDb } from '../../../common/models/project_db';

export namespace CreateProjectInfra {
	export type Input = {
		projectId: string;
		title: string;
		year: number;
		description: string;
		isTop: boolean;
		env: Env;
	};

	export type Output = { project: ProjectDb };
}
