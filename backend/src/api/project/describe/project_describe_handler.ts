import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { RequestParams } from '../../../types';
import { z } from 'zod';
import { ListProjectInput } from './project_describe_types';
import describeProjectAdapter from './project_describe_adapter';
import { ApiResponse } from '../../response';
import { ProjectResponse } from '../common/project_types';

export async function describeProjectHandler(request: Request, env: Env) {
	try {
		const { id } = (request as RequestParams).params;
		const validInput = checkInputValidations({ id });

		const projectOutput = await describeProjectAdapter(validInput.id, env);

		const apiResponse: ApiResponse<ProjectResponse> = {
			response: 'Project retrieved successfully',
			data: projectOutput,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}

function checkInputValidations({ id }: ListProjectInput): ListProjectInput {
	const ProjectPayloadSchema = z.object({
		id: z.string().uuid(),
	});

	const result = ProjectPayloadSchema.safeParse({ id });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
