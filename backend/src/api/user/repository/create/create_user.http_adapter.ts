import { ImagesUsecases } from '../../../images/application/images.usecases';
import { CreateUserPorts, CreateUserPortsTypes, UploadImagePortsTypes } from '../../application/create/create_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class CreateUserHttpAdapter implements CreateUserPorts {
	constructor(private readonly client: UserInfra, private readonly imagesUsecases: ImagesUsecases) {}

	async uploadImage({ file, project, env }: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output> {
		return await this.imagesUsecases.uploadImage({ file, project, env });
	}

	async insertUser({
		email,
		passwordHashed,
		name,
		phone,
		direction,
		imageKey,
		env,
	}: CreateUserPortsTypes.Input): Promise<CreateUserPortsTypes.Output> {
		const userResponse = await this.client.insertUser({ email, passwordHashed, name, phone, direction, imageKey, env });

		return {
			user: mapUserDbToApp(userResponse.user),
		};
	}
}
