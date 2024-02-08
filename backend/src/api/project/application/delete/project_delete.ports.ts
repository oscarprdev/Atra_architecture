import { Env } from '../../../..';
import { ProjectResponse } from '../../common/project_types';

export interface DeleteProjectPorts {
	deleteProject(input: DeleteProjectPortsTypes.Input): Promise<DeleteProjectPortsTypes.Output>;
	deleteItemByKey(input: DeleteItemByKeyPortsTypes.Input): Promise<void>;
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

export namespace DeleteItemByKeyPortsTypes {
	export type Input = {
		key: string;
		env: Env;
	};
}
