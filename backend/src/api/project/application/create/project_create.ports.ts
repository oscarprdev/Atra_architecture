import { Env } from '../../../..';
import { File } from '../../../generated';
import { ProjectResponse } from '../../shared/project_types';

export interface ProjectCreatePorts {
	insertProject(input: InsertProjectPorts.Input): Promise<InsertProjectPorts.Output>;
	insertImage(input: InsertImagePorts.Input): Promise<void>;
	uploadImage(input: UploadImagePorts.Input): Promise<UploadImagePorts.Output>;
}

export namespace InsertProjectPorts {
	export type Input = {
		projectBody: ProjectBody;
	};

	export type Output = {
		project: ProjectResponse;
	};

	export type ProjectBody = {
		projectId: string;
		title: string;
		year: number;
		description: string;
		isTop: boolean;
		env: Env;
	};
}

export namespace InsertImagePorts {
	export type Input = {
		key: string;
		isMain: boolean;
		projectId: string;
		env: Env;
	};
}

export namespace UploadImagePorts {
	export type Input = {
		file: File;
		key: string;
		type: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}
