import { Env } from '../../../..';
import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { UpdateProjectPorts } from './update_project.ports';
import { UpdateProjectUsecasesTypes } from './update_project.types';

export interface UpdateProjectUsecase {
	updateProject(input: UpdateProjectUsecasesTypes.UpdateProjectInput): Promise<UpdateProjectUsecasesTypes.UpdateProjectOutput>;
}

export class DefaultUpdateProjectUsecase implements UpdateProjectUsecase {
	constructor(private readonly ports: UpdateProjectPorts) {}

	private async removeOldProjectImages(oldTitle: string, env: Env) {
		const { images } = await this.ports.selectImagesByProjectFromBucket({ project: oldTitle, env });

		await Promise.all([
			this.ports.removeImagesFromBucket({ images: images, env }),
			this.ports.removeImagesFromDb({ imageKeys: images.map((img) => img.Key), env }),
		]);
	}

	private async checkProjectWithSameTitle(env: Env, projectBodyTitle: string, id: string) {
		const { titles } = await this.ports.listProjectsTitles({ env, id });

		const isTitleAlreadyCreated = titles.some((title) => title === projectBodyTitle);

		if (isTitleAlreadyCreated) {
			throw new Error('Title already created');
		}
	}

	async updateProject({
		updateProjectBody,
		env,
	}: UpdateProjectUsecasesTypes.UpdateProjectInput): Promise<UpdateProjectUsecasesTypes.UpdateProjectOutput> {
		try {
			await this.checkProjectWithSameTitle(env, updateProjectBody.title, updateProjectBody.id);

			if (updateProjectBody.title !== updateProjectBody.oldTitle) {
				await this.removeOldProjectImages(updateProjectBody.oldTitle, env);
			}

			const titleFormatted = updateProjectBody.title.replaceAll(' ', '_');
			const { images } = await this.ports.selectImagesByProjectFromBucket({ project: titleFormatted, env });

			const allImagesFromInput = updateProjectBody.images.concat(updateProjectBody.mainImage);

			const imagesToRemove = images.filter((img) => {
				const inputImgKeys = allImagesFromInput
					.filter((inputImg) => !Boolean(inputImg instanceof File))
					.map((inputImg) => JSON.parse(inputImg.toString()).Key);

				return !inputImgKeys.includes(img.Key);
			});
			const imagesToUpload = allImagesFromInput.filter((img) => img instanceof File);

			if (imagesToRemove.length > 0) {
				await Promise.all([
					this.ports.removeImagesFromBucket({ images: imagesToRemove, env }),
					this.ports.removeImagesFromDb({ imageKeys: imagesToRemove.map((img) => img.Key), env }),
				]);
			}

			const [projectResponse, imagesUploaded] = await Promise.all([
				this.ports.updateProject({
					projectBody: {
						projectId: updateProjectBody.id,
						title: updateProjectBody.title,
						description: updateProjectBody.description,
						isTop: updateProjectBody.isTop,
						year: updateProjectBody.year,
					},
					env,
				}),
				this.ports.uploadImagesOnBucket({ images: imagesToUpload, project: updateProjectBody.title, env }),
			]);

			await Promise.all(
				imagesUploaded.images.map((img) =>
					this.ports.insertImageOnDb({
						imageKey: img.Key,
						projectId: projectResponse.project.id,
						isMain: Boolean(updateProjectBody.mainImage.name && img.Key.includes(updateProjectBody.mainImage.name)),
						env,
					})
				)
			);

			const mainImage = imagesUploaded.images.find((img) =>
				img.Key.match(updateProjectBody.mainImage.name || updateProjectBody.mainImage.Key)
			);

			const restOfImages = mainImage
				? imagesUploaded.images.filter((img) => !img.Key.match(mainImage.name || mainImage.Key))
				: imagesUploaded.images;

			return {
				project: { ...projectResponse.project, images: restOfImages, mainImage: mainImage || updateProjectBody.mainImage },
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error updating project'}`,
				})
			);
		}
	}
}
