import { _Object } from '@aws-sdk/client-s3';
import { Env } from '../../..';
import { Bucket } from '../../shared/s3_bucket/bucket';

export interface BucketInfra {
	getItemByKey(key: string, env: Env): Promise<_Object | undefined>;
	uploadImage(uint8Array: Uint8Array, key: string, type: string, env: Env): Promise<_Object | undefined>;
	deleteItemByKey(key: string, env: Env): Promise<void>;
}

export class DefaultBucketInfra implements BucketInfra {
	constructor() {}

	useBucket(env: Env) {
		return new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);
	}

	async getItemByKey(key: string, env: Env): Promise<_Object | undefined> {
		try {
			const bucket = this.useBucket(env);

			return await bucket.getItemByKey(key);
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error S3: ${error instanceof Error ? error.message : 'Error retrieving item form S3 by key'}`,
				})
			);
		}
	}

	async uploadImage(uint8Array: Uint8Array, key: string, type: string, env: Env): Promise<_Object | undefined> {
		try {
			const bucket = this.useBucket(env);

			await bucket.uploadFile(uint8Array, key, type);

			return await bucket.getItemByKey(key);
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error S3: ${error instanceof Error ? error.message : 'Error uploading image to S3'}`,
				})
			);
		}
	}

	async deleteItemByKey(key: string, env: Env): Promise<void> {
		try {
			const bucket = this.useBucket(env);

			await bucket.deleteItemByKey(key);
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error S3: ${error instanceof Error ? error.message : 'Error deleting item from S3'}`,
				})
			);
		}
	}
}
