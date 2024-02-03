import { Env } from '../../../..';
import { Bucket } from '../../../../bucket';

async function uploadMainImage(mainImage: File, project: string, env: Env) {
	return await uploadImageToBucket(mainImage, project, env);
}

async function uploadImages(images: File[], project: string, env: Env) {
	return await Promise.all(images.map((image) => uploadImageToBucket(image, project, env)));
}

async function uploadImageToBucket(image: File, project: string, env: Env) {
	try {
		const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

		const imageId = crypto.randomUUID().toString();
		const projectName = project.replaceAll(' ', '_');
		const key = `${projectName}/${imageId}`;

		const fileBuffer = await image.arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		await bucket.uploadFile(uint8Array, key, image.type);

		return await bucket.getItemByKey(key);
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error managing images on bucket'}`,
			})
		);
	}
}

export { uploadMainImage, uploadImages };
