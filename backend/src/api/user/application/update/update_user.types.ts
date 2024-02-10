import { Env } from '../../../..';
import { UpdateUserBody } from '../../../generated';

export namespace UpdateUserUsecasesTypes {
	export type UpdateUserInput = {
		userBody: UpdateUserBody;
		env: Env;
	};
}
