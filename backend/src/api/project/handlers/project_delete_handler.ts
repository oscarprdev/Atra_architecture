import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { RequestParams } from '../../../types';
import { z } from 'zod';
import { projectDeleteUsecase } from '../graph';
import { DeleteProjectInput } from './handlers.types';
import { ApiResponse } from '../../shared/models/api_response';

export async function deleteProjectHandler(request: Request, env: Env) {
	try {
		const { id } = (request as RequestParams).params;
		const validInput = checkInputValidations({ id });

		await projectDeleteUsecase.deleteProject({ projectId: validInput.id, env });

		const apiResponse: ApiResponse<null> = {
			status: 202,
			response: 'Project deleted successfully',
			data: null,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 202,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}

function checkInputValidations({ id }: DeleteProjectInput): DeleteProjectInput {
	const ProjectPayloadSchema = z.object({
		id: z.string().uuid(),
	});

	const result = ProjectPayloadSchema.safeParse({ id });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
