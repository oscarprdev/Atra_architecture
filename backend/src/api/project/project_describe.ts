import { Env } from '../..';
import { Bucket } from '../../bucket';
import { RequestParams } from '../../types';

export async function describeProjectHandler(request: Request, env: Env) {
	const { id } = (request as RequestParams).params;

	const key = id.replace('%2F', '/');

	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);
	const response = await bucket.getItemByKey(key);

	return Response.json('success');
}
