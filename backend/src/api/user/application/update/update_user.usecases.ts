import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { User } from '../../../generated';
import { UpdateUserPorts } from './update_user.ports';
import { UpdateUserUsecasesTypes } from './update_user.types';

const PROJECT = 'personal';

export interface UpdateUserUsecases {
	updateUser(input: UpdateUserUsecasesTypes.UpdateUserInput): Promise<User>;
}

export class DefaultUpdateUserUsecases implements UpdateUserUsecases {
	constructor(private readonly ports: UpdateUserPorts) {}

	async updateUser({
		userBody: { email, image, name, phone, direction, description },
		env,
	}: UpdateUserUsecasesTypes.UpdateUserInput): Promise<User> {
		try {
			const {
				user: { imageKey, id },
			} = await this.ports.selectUser({ env });

			const [_, imageUploaded] = await Promise.all([
				this.ports.deleteImage({ key: imageKey, env }),
				this.ports.uploadImage({ file: image as File, project: PROJECT, env }),
			]);

			const imgKey = `${PROJECT}/${imageUploaded.image.name}`;

			const { user } = await this.ports.updateUser({
				id,
				email,
				name,
				phone,
				direction,
				description,
				imageKey: imgKey,
				env,
			});

			return {
				...user,
				image: imgKey,
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
