import { Env } from '../../../..';

export namespace ProjectListUsecasesTypes {
	export type Input = {
		search?: string;
		page: number;
		env: Env;
	};
}
