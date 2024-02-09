import { Env } from '../../../..';
import { File } from '../../../generated';

export namespace UpdateUserUsecasesTypes {
	export type UpdateUserInput = {
		email: string;
		name: string;
		phone: number;
		direction: string;
		image: File;
		env: Env;
	};
}
