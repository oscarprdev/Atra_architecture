import { IMAGE_URL } from '../constants';

export const extractFilename = (imagekey: string) => {
	const parts = imagekey.split('-');
	const nonUuidParts = parts.splice(0, parts.length - 5);
	return nonUuidParts.length > 0 ? nonUuidParts.join('-') : imagekey;
};

export const createFileFromImageUrl = async (imageKey: string) => {
	const filename = extractFilename(imageKey.split('/')[1]);

	const response = await fetch(`${IMAGE_URL}/${imageKey.replaceAll('/', '%2F')}`);

	const blob = await response.blob();

	return new File([blob], filename, { type: blob.type });
};
