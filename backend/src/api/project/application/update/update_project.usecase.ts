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

	async updateProject({
		updateProjectBody,
		env,
	}: UpdateProjectUsecasesTypes.UpdateProjectInput): Promise<UpdateProjectUsecasesTypes.UpdateProjectOutput> {
		try {
			if (updateProjectBody.title !== updateProjectBody.oldTitle) {
				await this.removeOldProjectImages(updateProjectBody.oldTitle, env);
			}

			const titleFormatted = updateProjectBody.title.replaceAll(' ', '_');
			const { images } = await this.ports.selectImagesByProjectFromBucket({ project: titleFormatted, env });

			const allImagesFromInput = updateProjectBody.images.concat(updateProjectBody.mainImage);

			const imagesToRemove = images.filter(
				(img) => !allImagesFromInput.map((img) => img.name || img.Key).some((val) => img.Key.match(val))
			);
			const imagesToUpload = allImagesFromInput.filter(
				(img) => !images.map((img) => img.Key).some((val) => val.match(img.name || img.Key))
			);

			console.log(imagesToRemove);

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
						isMain: updateProjectBody.mainImage.Key === img.Key,
						env,
					})
				)
			);

			return {
				project: { ...projectResponse.project, images: updateProjectBody.images, mainImage: updateProjectBody.mainImage },
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
