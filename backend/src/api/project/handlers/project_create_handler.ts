import { z } from 'zod';
import convertToBoolean from '../../shared/utils/convert_to_bool';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { projectCreateUsecase } from '../graph';
import { CreateProjectBody, File as ApiFile, Project } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function createProjectHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const title = formData.get('title')?.toString() || 'Default title';
		const year = Number(formData.get('year'));
		const description = formData.get('description')?.toString() || 'Default description';
		const isTop = convertToBoolean(formData.get('isTop'));
		const mainImage = formData.get('mainImage') as unknown as ApiFile;
		const images = formData.getAll('images') as unknown as ApiFile[];

		const validInput = checkInputValidations({ title, year, description, isTop, mainImage, images });

		const projectOutput = await projectCreateUsecase.createProject({ projectBody: validInput, env });

		const apiResponse: ApiResponse<Project> = {
			status: 201,
			response: 'Project uploaded successfully',
			data: projectOutput,
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

function checkInputValidations({ title, description, year, isTop, mainImage, images }: CreateProjectBody): CreateProjectBody {
	const ProjectPayloadSchema = z.object({
		title: z.string(),
		year: z.number(),
		description: z.string(),
		isTop: z.boolean(),
	});

	const result = ProjectPayloadSchema.safeParse({ title, year, description, isTop });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return {
		title,
		description,
		year,
		isTop,
		mainImage,
		images,
	};
}
