import { ProjectDb, ProjectResponse } from '../../../shared/project_types';

export const mapProjectDbToApp = (project: ProjectDb): ProjectResponse => {
	return {
		id: project.project_id,
		title: project.title,
		year: project.year,
		description: project.description,
		isTop: project.is_top === 1,
		createdAt: project.created_at,
		updatedAt: project.updated_at,
		mainImage: project.main_image,
		images: project.images,
	};
};
