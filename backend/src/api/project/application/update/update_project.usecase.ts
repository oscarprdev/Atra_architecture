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
			this.ports.removeImagesFromBucket({ images: images.map((img) => `${oldTitle}/${img.name}`), env }),
			this.ports.removeImagesFromDb({ imageKeys: images.map((img) => `${oldTitle}/${img.name}`), env }),
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

			const { project } = await this.ports.provideCurrentProject({ env, id: updateProjectBody.id });

			const titleFormatted = updateProjectBody.title.replaceAll(' ', '_');
			const { images } = await this.ports.selectImagesByProjectFromBucket({ project: titleFormatted, env });

			const allImagesFromInput = updateProjectBody.images.concat(updateProjectBody.mainImage);
			const inputImgString = allImagesFromInput.filter((input) => !(input instanceof File)) as unknown as string[];

			if (updateProjectBody.title !== project.title) {
				await this.removeOldProjectImages(project.title, env);
			} else {
				const imagesToRemove = images.filter((img) => !inputImgString.includes(`${project.title}/${img.name}`));

				const imagesToRemoveKeys = imagesToRemove.map((img) => `${titleFormatted}/${img.name}`);

				if (imagesToRemove.length > 0) {
					await Promise.all([
						this.ports.removeImagesFromBucket({ images: imagesToRemoveKeys, env }),
						this.ports.removeImagesFromDb({ imageKeys: imagesToRemoveKeys, env }),
					]);
				}
			}

			const imagesAlreadyStored = images.filter((img) => inputImgString.includes(`${titleFormatted}/${img.name}`));
			const imagesToUpload = [...allImagesFromInput.filter((img) => img instanceof File), ...imagesAlreadyStored];

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
				this.ports.uploadImagesOnBucket({ images: imagesToUpload as File[], project: updateProjectBody.title, env }),
			]);

			await Promise.all(
				imagesUploaded.images.map((img) =>
					this.ports.insertImageOnDb({
						imageKey: `${titleFormatted}/${img.name}`,
						projectId: projectResponse.project.id,
						isMain: Boolean((updateProjectBody.mainImage as File).name && img.name.includes((updateProjectBody.mainImage as File).name)),
						env,
					})
				)
			);

			const mainImage = imagesUploaded.images.find((img) => img.name.match((updateProjectBody.mainImage as File).name));

			const restOfImages = mainImage ? imagesUploaded.images.filter((img) => !img.name.match(mainImage.name)) : imagesUploaded.images;

			return {
				project: {
					...projectResponse.project,
					images: restOfImages.map((img) => `${titleFormatted}/${img.name}`),
					mainImage: `${titleFormatted}/${mainImage?.name}`,
				},
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
