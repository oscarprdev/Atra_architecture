export default function generateImageKey(project: string) {
	const imageId = crypto.randomUUID().toString();
	const projectName = project.replaceAll(' ', '_');

	return `${projectName}/${imageId}`;
}
