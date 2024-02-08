import { Value } from '@libsql/client/web';
import { ProjectDb } from '../../../common/models/project_db';
import { Env } from '../../../..';

export namespace InsertImageInfra {
	export type Input = {
		key: string;
		isMain: boolean;
		projectId: Value;
		env: Env;
	};

	export type Output = { project: ProjectDb };
}
