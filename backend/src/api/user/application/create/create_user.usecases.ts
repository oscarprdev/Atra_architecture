import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { User } from '../../../generated';
import { AuthUsecases } from '../../shared/auth.usecases';
import { CreateUserPorts } from './create_user.ports';
import { CreateUserUsecasesTypes } from './create_user.types';

const PROJECT = 'personal';

export interface CreateUserUsecases {
	createUser(input: CreateUserUsecasesTypes.Input): Promise<CreateUserUsecasesTypes.Output>;
}

export class DefaultCreateUserUsecases extends AuthUsecases implements CreateUserUsecases {
	constructor(private readonly ports: CreateUserPorts) {
		super();
	}

	async createUser({
		userBody: { email, image, name, phone, direction, description, password },
		env,
	}: CreateUserUsecasesTypes.Input): Promise<CreateUserUsecasesTypes.Output> {
		try {
			const userImage = await this.ports.uploadImage({ file: image as File, project: PROJECT, env });
			const passwordHashed = await this.hashPassword(password, env.SALT);

			const imgKey = `${PROJECT}/${userImage.image.name}`;

			const { user } = await this.ports.insertUser({
				email,
				name,
				phone,
				direction,
				description,
				passwordHashed,
				imageKey: imgKey,
				env,
			});

			return { user: { ...user, image: imgKey } satisfies User };
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
