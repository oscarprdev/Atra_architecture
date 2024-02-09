import { Env } from '../../../..';
import extractErrorInfo from '../../../../utils/extract_from_error_info';
import { File, User } from '../../../generated';
import { UserUsecases } from '../../shared/user.usecases';
import { CreateUserPorts } from './create_user.ports';
import { CreateUserUsecasesTypes } from './create_user.types';

export interface CreateUserUsecases {
	createUser(input: CreateUserUsecasesTypes.Input): Promise<CreateUserUsecasesTypes.Output>;
}

export class DefaultCreateUserUsecases extends UserUsecases implements CreateUserUsecases {
	constructor(private readonly ports: CreateUserPorts) {
		super();
	}

	private async hashPassword(password: string, hexSalt: string): Promise<string> {
		const encoder = new TextEncoder();

		const passwordBuffer = encoder.encode(password);

		const salt = this.hexStringToUint8Array(hexSalt);

		const saltedPassword = new Uint8Array(salt.length + passwordBuffer.length);
		saltedPassword.set(salt, 0);
		saltedPassword.set(passwordBuffer, salt.length);

		const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);

		const hashedPassword = Array.from(new Uint8Array(hashedBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

		return hashedPassword;
	}

	private async uploadImage(image: File, project: string, env: Env) {
		const key = this.generateImageKey(project);
		const type = image.Type || 'image/jpg';

		return await this.ports.uploadImage({ file: image, key, type, env });
	}

	async createUser({
		userBody: { email, image, name, phone, direction, password },
		env,
	}: CreateUserUsecasesTypes.Input): Promise<CreateUserUsecasesTypes.Output> {
		try {
			const userImage = await this.uploadImage(image, 'personal', env);
			const passwordHashed = await this.hashPassword(password, env.SALT);

			const { user } = await this.ports.insertUser({
				email,
				name,
				phone,
				direction,
				passwordHashed,
				imageKey: userImage.image.Key,
				env,
			});

			return { user: { ...user, image: userImage.image } satisfies User };
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error creating user'}`,
				})
			);
		}
	}
}
