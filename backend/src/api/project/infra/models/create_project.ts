import { Env } from '../../../..';
import { ProjectDb } from '../../shared/project_types';

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
