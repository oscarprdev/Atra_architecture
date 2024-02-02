import { Env } from '../..';
import { Bucket } from '../../bucket';
import { RequestParams } from '../../types';

export async function listProjectHandler(request: Request, env: Env) {
	const { project } = (request as RequestParams).params;

	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	const response = await bucket.getItemsByEntity(project);

	return new Response('success', { status: 200 });
}
