import { Env } from '../../..';
import uploadProjectToInfra from './infra/project_upload_infra';
import { ProjectInput, UploadProjectAdapterOutput } from './project_upload_types';

async function uploadProjectAdapter(input: ProjectInput, env: Env): Promise<UploadProjectAdapterOutput> {
	const { project_id, title, description, year, is_top, created_at, updated_at, mainImage, images } = await uploadProjectToInfra(
		input,
		env
	);

	return {
		projectId: project_id,
		title,
		description,
		year,
		isTop: is_top === 1,
		createdAt: new Date(created_at),
		updatedAt: new Date(updated_at),
		mainImage: mainImage as File,
		images: images as File[],
	};
}

export default uploadProjectAdapter;
