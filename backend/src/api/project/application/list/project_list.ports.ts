import { Env } from '../../../..';
import { File } from '../../../generated';
import { ProjectResponse } from '../../shared/project_types';

export interface ProjectListPorts {
	listProjects(input: ProjectListPortsTypes.Input): Promise<ProjectListPortsTypes.Output>;
	getImageByKey(input: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output>;
}

export namespace ProjectListPortsTypes {
	export type Input = {
		env: Env;
	};

	export type Output = {
		projects: ProjectResponse[];
	};
}

export namespace GetImageByKeyPorts {
	export type Input = {
		key: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}
