export default function generateImageKey(project: string, name?: string) {
	const imageId = crypto.randomUUID().toString();
	const projectName = project.replaceAll(' ', '_');

	return `${projectName}/${name || 'name'}-${imageId}`;
}
