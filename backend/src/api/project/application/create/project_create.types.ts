import { Env } from '../../../..';
import { CreateProjectBody } from '../../../generated';

export namespace ProjectCreateUsecasesTypes {
	export type CreateProjectInput = {
		projectBody: CreateProjectBody;
		env: Env;
	};

	export type NextRequestInput = {
		mainImageKey: string;
		imagesKeys: string[];
		projectId: string;
		env: Env;
	};
}
