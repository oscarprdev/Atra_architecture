import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { Env } from '../../..';
import { RequestParams } from '../../../types';
import { z } from 'zod';
import { projectDescribeUsecase } from '../graph';
import { ListProjectInput } from './handlers.types';
import { Project } from '../../generated';
import { ApiResponse } from '../../shared/models/api_response';

export async function describeProjectHandler(request: Request, env: Env) {
	try {
		const { id } = (request as RequestParams).params;
		const validInput = checkInputValidations({ id });

		const projectOutput = await projectDescribeUsecase.describeProject(validInput.id, env);

		const apiResponse: ApiResponse<Project> = {
			status: 200,
			response: 'Project retrieved successfully',
			data: projectOutput,
		};

		return new Response(JSON.stringify(apiResponse), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(
			JSON.stringify({
				status,
				message,
			}),
			{
				status: status || 400,
			}
		);
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
