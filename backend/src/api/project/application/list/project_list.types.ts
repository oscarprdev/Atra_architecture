import { Env } from '../../../..';

export namespace ProjectListUsecasesTypes {
	export type Input = {
		page: number;
		env: Env;
	};
}
