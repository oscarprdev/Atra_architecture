import { Env } from '../../../..';

export namespace ProjectListUsecasesTypes {
	export type Input = {
		all?: boolean;
		search?: string;
		date?: boolean;
		year?: boolean;
		isTop?: boolean;
		page: number;
		env: Env;
	};
}
