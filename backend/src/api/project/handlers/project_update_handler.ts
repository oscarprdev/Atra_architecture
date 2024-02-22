import { z } from 'zod';
import convertToBoolean from '../../shared/utils/convert_to_bool';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { projectUpdateUsecase } from '../graph';
import { File as ApiFile, Project, UpdateProjectBody } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function updateProjectHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString();
		const oldTitle = formData.get('oldTitle')?.toString();
		const year = Number(formData.get('year'));
		const description = formData.get('description')?.toString();
		const isTop = convertToBoolean(formData.get('isTop'));
		const mainImage = formData.get('mainImage') as unknown as ApiFile;
		const images = formData.getAll('image') as unknown as ApiFile[];

		if (!id || !title || !year || !description || !oldTitle) {
			throw new Error(JSON.stringify({ status: 400, message: 'Body not valid' }));
		}

		const validInput = checkInputValidations({ id, title, oldTitle, year, description, isTop, mainImage, images });

		const projectOutput = await projectUpdateUsecase.updateProject({ updateProjectBody: validInput, env });

		const apiResponse: ApiResponse<Project> = {
			status: 201,
			response: 'Project updated successfully',
			data: projectOutput.project,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 201,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}

function checkInputValidations({ id, title, oldTitle, description, year, isTop, mainImage, images }: UpdateProjectBody): UpdateProjectBody {
	const ProjectPayloadSchema = z.object({
		id: z.string(),
		title: z.string(),
		oldTitle: z.string(),
		year: z.number(),
		description: z.string(),
		isTop: z.boolean(),
	});

	const result = ProjectPayloadSchema.safeParse({ id, title, oldTitle, year, description, isTop });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return {
		id,
		title,
		oldTitle,
		description,
		year,
		isTop,
		mainImage,
		images,
	};
}
