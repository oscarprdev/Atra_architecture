import { ImagesUsecases } from '../../../images/application/images.usecases';
import {
	DeleteImagePortsTypes,
	SelectUserPortsTypes,
	UpdateUserPorts,
	UpdateUserPortsTypes,
	UploadImagePortsTypes,
} from '../../application/update/update_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class UpdateUserHttpAdapter implements UpdateUserPorts {
	constructor(private readonly client: UserInfra, private readonly imagesUsecases: ImagesUsecases) {}

	async selectUser({ env }: SelectUserPortsTypes.Input): Promise<SelectUserPortsTypes.Output> {
		const { user } = await this.client.describeUser({ env });

		return {
			user: mapUserDbToApp(user),
		};
	}

	async uploadImage({ file, project, env }: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output> {
		return await this.imagesUsecases.uploadImage({ file, project, env });
	}

	async deleteImage({ key, env }: DeleteImagePortsTypes.Input): Promise<void> {
		await this.imagesUsecases.deleteImageByKey({ key, env });
	}

	async updateUser({ id, name, direction, phone, email, imageKey, env }: UpdateUserPortsTypes.Input): Promise<UpdateUserPortsTypes.Output> {
		const { user } = await this.client.updateUser({ id, name, direction, phone, email, imageKey, env });

		return {
			user: mapUserDbToApp(user),
		};
	}
}
