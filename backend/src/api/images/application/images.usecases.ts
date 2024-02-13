import generateImageKey from '../utils/generate_image_key';
import { ImagesPorts } from './images.ports';
import { ImagesUsecasesTypes } from './images.types';

const DEFAULT_TYPE = 'image/jpg';

export interface ImagesUsecases {
	getImageByKey(input: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput>;
	getImagesByEntity(input: ImagesUsecasesTypes.GetImagesByEntityInput): Promise<ImagesUsecasesTypes.GetImagesByEntityOutput>;

	uploadImage(input: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput>;
	uploadImages(input: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput>;

	deleteImageByKey(input: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void>;
}

export class DefaultImagesUsecases implements ImagesUsecases {
	constructor(private readonly ports: ImagesPorts) {}

	async getImageByKey({ key, env }: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput> {
		const imageResponse = await this.ports.getImageByKey({ key, env });
		const type = imageResponse.image.Key.split('.')[1].split('-')[0];

		return {
			image: { ...imageResponse.image, Type: `image/${type}` },
		};
	}

	async getImagesByEntity({
		entity,
		env,
	}: ImagesUsecasesTypes.GetImagesByEntityInput): Promise<ImagesUsecasesTypes.GetImagesByEntityOutput> {
		return await this.ports.getImagesByEntity({ entity, env });
	}

	async uploadImage({ file, project, env }: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput> {
		const key = generateImageKey(project, file.name);
		const type = file.Type || DEFAULT_TYPE;

		return await this.ports.uploadImage({ file, key, type, env });
	}

	async uploadImages({ files, project, env }: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput> {
		const result = await Promise.all(files.map((image) => this.uploadImage({ file: image, project, env })));

		return {
			images: result.map((r) => ({ ...r.image, Type: r.image.Type || DEFAULT_TYPE })),
		};
	}

	async deleteImageByKey({ key, env }: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void> {
		await this.ports.deleteImageByKey({ key, env });
	}
}
