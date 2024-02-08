import { _Object } from '@aws-sdk/client-s3';
import { Env } from '../../..';
import { Bucket } from '../../common/s3_bucket/bucket';

export interface BucketInfra {
	getItemByKey(key: string, env: Env): Promise<_Object | undefined>;
	uploadImage(uint8Array: Uint8Array, key: string, type: string, env: Env): Promise<_Object | undefined>;
}

export class DefaultBucketInfra implements BucketInfra {
	constructor() {}

	useBucket(env: Env) {
		return new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);
	}

	async getItemByKey(key: string, env: Env): Promise<_Object | undefined> {
		const bucket = this.useBucket(env);

		return await bucket.getItemByKey(key);
	}

	async uploadImage(uint8Array: Uint8Array, key: string, type: string, env: Env): Promise<_Object | undefined> {
		const bucket = this.useBucket(env);

		await bucket.uploadFile(uint8Array, key, type);

		return await bucket.getItemByKey(key);
	}
}
