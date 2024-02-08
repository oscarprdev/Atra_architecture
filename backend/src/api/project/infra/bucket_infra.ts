import { _Object } from '@aws-sdk/client-s3';
import { Env } from '../../..';
import { Bucket } from '../../common/s3_bucket/bucket';

export interface BucketInfra {
	getItemByKey(key: string, env: Env): Promise<_Object | undefined>;
}

export class DefaultBucketInfra implements BucketInfra {
	constructor() {}

	useBucket(env: Env) {
		return new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);
	}

	async getItemByKey(key: string, env: Env): Promise<_Object | undefined> {
		const bucket = this.useBucket(env);
		const bucketObject = await bucket.getItemByKey(key);

		return bucketObject;
	}
}
