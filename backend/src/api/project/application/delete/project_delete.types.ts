import { Env } from '../../../..';

export namespace ProjectDeleteUsecasesTypes {
	export type Input = {
		projectId: string;
		env: Env;
	};
}
