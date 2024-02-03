import { Env } from '../../../..';
import uploadImageToBucket from '../../common/upload_image';

async function uploadMainImage(mainImage: File, project: string, env: Env) {
	return await uploadImageToBucket(mainImage, project, env);
}

async function uploadImages(images: File[], project: string, env: Env) {
	return await Promise.all(images.map((image) => uploadImageToBucket(image, project, env)));
}

export { uploadMainImage, uploadImages };
