import { Env } from '../../../..';
import { Project } from '../../../generated';

export interface ProjectDescribePorts {
	describeProject(input: DescribeProjectPorts.Input): Promise<DescribeProjectPorts.Output>;
	getImageByKey(input: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output>;
}

export namespace DescribeProjectPorts {
	export type Input = {
		projectId: string;
		nextRequest(mainImageKey: string, imagesKeys: string, env: Env): Promise<NextRequestOutput>;
		env: Env;
	};

	export type Output = {
		project: Project;
	};

	export type NextRequestOutput = {
		mainImage: string;
		images: string[];
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
