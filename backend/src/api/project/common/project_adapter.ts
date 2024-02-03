import { ProjectInfraResponse } from './project_types';

function mapProjectInfraToApp({
	project_id,
	title,
	description,
	year,
	is_top,
	created_at,
	updated_at,
	main_image,
	images,
}: ProjectInfraResponse) {
	return {
		projectId: project_id,
		title,
		description,
		year,
		isTop: is_top === 1,
		createdAt: new Date(created_at),
		updatedAt: new Date(updated_at),
		mainImage: main_image as File,
		images: images as File[],
	};
}

export default mapProjectInfraToApp;
