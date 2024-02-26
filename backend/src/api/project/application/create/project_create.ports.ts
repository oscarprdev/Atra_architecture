import { Env } from '../../../..';
import { File } from '../../../generated';
import { ProjectResponse } from '../../shared/project_types';

export interface ProjectCreatePorts {
	insertProject(input: InsertProjectPorts.Input): Promise<InsertProjectPorts.Output>;
	insertImage(input: InsertImagePorts.Input): Promise<void>;
	uploadImage(input: UploadImagePorts.Input): Promise<UploadImagePorts.Output>;
	uploadImages(input: UploadImagesPorts.Input): Promise<UploadImagesPorts.Output>;
	listProjectsTitles(input: ListProjectsTitles.Input): Promise<ListProjectsTitles.Output>;
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
		project: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}

export namespace UploadImagesPorts {
	export type Input = {
		files: File[];
		project: string;
		env: Env;
	};

	export type Output = {
		images: File[];
	};
}

export namespace ListProjectsTitles {
	export type Input = {
		env: Env;
	};

	export type Output = {
		titles: string[];
	};
}
