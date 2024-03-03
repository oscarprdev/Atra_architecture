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
		const oldTitleFormatted = oldTitle.replaceAll(' ', '_');
		const { images } = await this.ports.selectImagesByProjectFromBucket({ project: oldTitleFormatted, env });

		await Promise.all([
			this.ports.removeImagesFromBucket({ images: images.map((img) => `${oldTitleFormatted}/${img.name}`), env }),
			this.ports.removeImagesFromDb({ imageKeys: images.map((img) => `${oldTitleFormatted}/${img.name}`), env }),
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

			// // Remove all images already stored
			const { project } = await this.ports.provideCurrentProject({ env, id: updateProjectBody.id });
			await this.removeOldProjectImages(project.title, env);

			// Upload images on bucket
			const allImagesFromInput = updateProjectBody.images.concat(updateProjectBody.mainImage);
			const imagesUploaded = await this.ports.uploadImagesOnBucket({
				images: allImagesFromInput as File[],
				project: updateProjectBody.title,
				env,
			});

			// Insert images on db
			const titleFormatted = updateProjectBody.title.replaceAll(' ', '_');
			await Promise.all(
				imagesUploaded.images.map((img) =>
					this.ports.insertImageOnDb({
						imageKey: `${titleFormatted}/${img.name}`,
						projectId: updateProjectBody.id,
						isMain: Boolean((updateProjectBody.mainImage as File).name && img.name.includes((updateProjectBody.mainImage as File).name)),
						env,
					})
				)
			);

			//Insert project on db
			const projectResponse = await this.ports.updateProject({
				projectBody: {
					projectId: updateProjectBody.id,
					title: updateProjectBody.title,
					description: updateProjectBody.description,
					isTop: updateProjectBody.isTop,
					year: updateProjectBody.year,
				},
				env,
			});

			// Return project with images
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

	async updateIsTop({
		id,
		isTop,
		env,
	}: UpdateProjectUsecasesTypes.UpdateIsTopInput): Promise<UpdateProjectUsecasesTypes.UpdateIsTopOutput> {
		try {
			const { project } = await this.ports.provideCurrentProject({ id, env });

			const updatedProject = {
				projectId: project.id,
				title: project.title,
				year: project.year,
				description: project.description,
				isTop,
			};

			const projectResponse = await this.ports.updateProject({ projectBody: updatedProject, env });

			return {
				project: {
					...projectResponse.project,
					images: projectResponse.project.images.split(','),
				},
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error updating is top field'}`,
				})
			);
		}
	}
}
