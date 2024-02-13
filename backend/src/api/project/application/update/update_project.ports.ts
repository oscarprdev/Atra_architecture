import { Env } from '../../../..';
import { File } from '../../../generated';
import { ProjectResponse } from '../../shared/project_types';

export interface UpdateProjectPorts {
	selectImagesByProjectFromBucket(input: SelectImagesByProjectFromBucketPorts.Input): Promise<SelectImagesByProjectFromBucketPorts.Output>;
	removeImagesFromBucket(input: RemoveImagesFromBucketPorts.Input): Promise<void>;
	uploadImagesOnBucket(input: UploadImagesOnBucketPorts.Input): Promise<UploadImagesOnBucketPorts.Output>;

	removeImagesFromDb(input: RemoveImagesFromDbPorts.Input): Promise<void>;
	insertImageOnDb(input: InsertImageOnDbPorts.Input): Promise<void>;

	updateProject(input: UpdateProjectPorts.Input): Promise<UpdateProjectPorts.Output>;
}

export namespace SelectImagesByProjectFromBucketPorts {
	export type Input = {
		project: string;
		env: Env;
	};

	export type Output = {
		images: File[];
	};
}

export namespace RemoveImagesFromBucketPorts {
	export type Input = {
		images: File[];
		env: Env;
	};
}

export namespace UploadImagesOnBucketPorts {
	export type Input = {
		images: File[];
		project: string;
		env: Env;
	};

	export type Output = {
		images: File[];
	};
}

export namespace RemoveImagesFromDbPorts {
	export type Input = {
		imageKeys: string[];
		env: Env;
	};
}

export namespace InsertImageOnDbPorts {
	export type Input = {
		imageKey: string;
		projectId: string;
		isMain: boolean;
		env: Env;
	};
}

export namespace UpdateProjectPorts {
	export type Input = {
		projectBody: ProjectBody;
		env: Env;
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
	};
}
