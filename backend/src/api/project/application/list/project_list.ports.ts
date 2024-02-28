import { Env } from '../../../..';
import { ProjectResponse } from '../../shared/project_types';

export interface ProjectListPorts {
	listProjects(input: ProjectListPortsTypes.Input): Promise<ProjectListPortsTypes.Output>;
	getImageByKey(input: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output>;
}

export namespace ProjectListPortsTypes {
	export type Input = {
		search?: string;
		date?: boolean;
		year?: boolean;
		isTop?: boolean;
		offset: number;
		limit: number;
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
