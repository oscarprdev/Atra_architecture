import { Env } from '../../../..';

export namespace DeleteImageInfra {
	export type Input = {
		imageKey: string;
		env: Env;
	};
}
