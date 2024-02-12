import { Env } from '../../../..';
import { ProjectResponse } from '../../shared/project_types';

export interface DeleteProjectPorts {
	deleteProject(input: DeleteProjectPortsTypes.Input): Promise<DeleteProjectPortsTypes.Output>;
	deleteImageByKey(input: DeleteImageByKeyPortsTypes.Input): Promise<void>;
}

export namespace DeleteProjectPortsTypes {
	export type Input = {
		projectId: string;
		env: Env;
	};

	export type Output = {
		project: ProjectResponse;
	};
}

export namespace DeleteImageByKeyPortsTypes {
	export type Input = {
		key: string;
		env: Env;
	};
}
