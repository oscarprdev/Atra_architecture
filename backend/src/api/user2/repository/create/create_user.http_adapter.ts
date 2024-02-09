import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { HttpAdapter } from '../../../shared/repository/http_adapter';
import { CreateUserPorts, CreateUserPortsTypes, UploadImagePortsTypes } from '../../application/create/create_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class CreateUserHttpAdapter extends HttpAdapter implements CreateUserPorts {
	constructor(private readonly client: UserInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async uploadImage({ file, key, type, env }: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output> {
		return await this.uploadImageToBucket({ file, key, type, env });
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
