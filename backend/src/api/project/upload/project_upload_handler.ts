import { z } from 'zod';
import convertToBoolean from '../../../utils/convert_to_bool';
import extractErrorInfo from '../../../utils/extract_from_error_info';
import uploadProjectAdapter from './project_upload_adapter';
import { ProjectInput } from './project_upload_types';
import { Env } from '../../..';

export async function uploadProjectHandler(request: Request, env: Env) {
	try {
		const formData = await request.formData();

		const title = formData.get('title')?.toString() || 'Default title';
		const year = Number(formData.get('year'));
		const description = formData.get('description')?.toString() || 'Default description';
		const isTop = convertToBoolean(formData.get('isTop'));
		const mainImage = formData.get('mainImage') as File;
		const images = formData.getAll('image') as File[];

		const validInput = checkInputValidations({ title, year, description, isTop, mainImage, images });

		const projectOutput = await uploadProjectAdapter(validInput, env);

		console.log(projectOutput, 'project output');

		return new Response(JSON.stringify(projectOutput), {
			status: 201,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}

function checkInputValidations({ title, description, year, isTop, mainImage, images }: ProjectInput): ProjectInput {
	const ProjectPayloadSchema = z.object({
		title: z.string(),
		year: z.number(),
		description: z.string(),
		isTop: z.boolean(),
		mainImage: z.instanceof(File),
		images: z.array(z.instanceof(File)),
	});

	const result = ProjectPayloadSchema.safeParse({ title, year, description, isTop, mainImage, images });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
