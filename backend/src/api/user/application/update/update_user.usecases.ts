import { Env } from '../../../..';
import extractErrorInfo from '../../../../utils/extract_from_error_info';
import { File, User } from '../../../generated';
import { UserUsecases } from '../../shared/user.usecases';
import { UpdateUserPorts } from './update_user.ports';
import { UpdateUserUsecasesTypes } from './update_user.types';

export interface UpdateUserUsecases {
	updateUser(input: UpdateUserUsecasesTypes.UpdateUserInput): Promise<User>;
}

export class DefaultUpdateUserUsecases extends UserUsecases implements UpdateUserUsecases {
	constructor(private readonly ports: UpdateUserPorts) {
		super();
	}

	private async uploadImage(image: File, project: string, env: Env) {
		const key = this.generateImageKey(project);
		const type = image.Type || 'image/jpg';

		return await this.ports.uploadImage({ file: image, key, type, env });
	}

	async updateUser({ userBody: { email, image, name, phone, direction }, env }: UpdateUserUsecasesTypes.UpdateUserInput): Promise<User> {
		try {
			const {
				user: { imageKey, id },
			} = await this.ports.selectUser({ env });

			const [_, imageUploaded] = await Promise.all([
				this.ports.deleteImage({ key: imageKey, env }),
				this.uploadImage(image, 'personal', env),
			]);

			if (!imageUploaded.image?.Key) {
				throw new Error(
					JSON.stringify({
						status: 500,
						message: 'Image not uploaded successfully',
					})
				);
			}

			const { user } = await this.ports.updateUser({ id, email, name, phone, direction, imageKey: imageUploaded.image.Key, env });

			return {
				...user,
				image: imageUploaded.image,
			} satisfies User;
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error updating user'}`,
				})
			);
		}
	}
}
