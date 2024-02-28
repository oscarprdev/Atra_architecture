import { Env } from '../../..';

export class ProjectUsecases {
	constructor() {}

	protected generateImageKey(project: string) {
		const imageId = crypto.randomUUID().toString();
		const projectName = project.replaceAll(' ', '_');

		return `${projectName}/${imageId}`;
	}
}
