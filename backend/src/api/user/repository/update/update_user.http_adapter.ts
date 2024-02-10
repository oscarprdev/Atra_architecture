import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { HttpAdapter } from '../../../shared/repository/http_adapter';
import {
	DeleteImagePortsTypes,
	SelectUserPortsTypes,
	UpdateUserPorts,
	UpdateUserPortsTypes,
	UploadImagePortsTypes,
} from '../../application/update/update_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class UpdateUserHttpAdapter extends HttpAdapter implements UpdateUserPorts {
	constructor(private readonly client: UserInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async selectUser({ env }: SelectUserPortsTypes.Input): Promise<SelectUserPortsTypes.Output> {
		const { user } = await this.client.describeUser({ env });

		return {
			user: mapUserDbToApp(user),
		};
	}

	async uploadImage({ file, key, type, env }: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output> {
		return await this.uploadImageToBucket({ file, key, type, env });
	}

	async deleteImage({ key, env }: DeleteImagePortsTypes.Input): Promise<void> {
		await this.deleteItemByKey({ key, env });
	}

	async updateUser({ id, name, direction, phone, email, imageKey, env }: UpdateUserPortsTypes.Input): Promise<UpdateUserPortsTypes.Output> {
		const { user } = await this.client.updateUser({ id, name, direction, phone, email, imageKey, env });

		return {
			user: mapUserDbToApp(user),
		};
	}
}
