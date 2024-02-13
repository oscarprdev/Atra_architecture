import { Value } from '@libsql/client/web';
import { ProjectDb } from '../../shared/project_types';
import { Env } from '../../../..';

export namespace InsertImageInfra {
	export type Input = {
		key: string;
		isMain: boolean;
		projectId: Value;
		env: Env;
	};
}
