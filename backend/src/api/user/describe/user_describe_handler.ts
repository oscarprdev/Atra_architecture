import extractErrorInfo from '../../../utils/extract_from_error_info';
import { Env } from '../../..';
import { RequestParams } from '../../../types';
import { z } from 'zod';
import { DescribeUserInput } from './user_describe_types';
import describeUserAdapter from './user_describe_adapter';

export async function describeUserHandler(request: Request, env: Env) {
	try {
		const { id } = (request as RequestParams).params;
		const validInput = checkInputValidations({ id });

		const userOutput = await describeUserAdapter(validInput.id, env);

		return new Response(JSON.stringify(userOutput), {
			status: 200,
		});
	} catch (error: unknown) {
		const { status, message } = extractErrorInfo(error);

		return new Response(JSON.stringify(message), {
			status: status || 400,
		});
	}
}

function checkInputValidations({ id }: DescribeUserInput): DescribeUserInput {
	const UserPayloadSchema = z.object({
		id: z.string().uuid(),
	});

	const result = UserPayloadSchema.safeParse({ id });

	if (!result.success) {
		throw new Error(JSON.stringify({ status: 400, message: result.error.format() }));
	}

	return result.data;
}
