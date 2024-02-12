import { ImagesUsecases } from '../../../images/application/images.usecases';
import { DescribeUserPorts, GetUserImagePorts } from '../../application/describe/describe_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class DescribeUserHttpAdapter implements DescribeUserPorts {
	constructor(private readonly client: UserInfra, private readonly imagesUsecases: ImagesUsecases) {}

	async describeUser({ env }: DescribeUserPorts.Input): Promise<DescribeUserPorts.Output> {
		const userResponse = await this.client.describeUser({ env });

		return {
			user: mapUserDbToApp(userResponse.user),
		};
	}

	async getUserImage({ key, env }: GetUserImagePorts.Input): Promise<GetUserImagePorts.Output> {
		return await this.imagesUsecases.getImageByKey({ key, env });
	}
}
