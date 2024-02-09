import { BucketInfra } from '../../../shared/infra/bucket_infra';
import { HttpAdapter } from '../../../shared/repository/http_adapter';
import { DescribeUserPorts, GetUserImagePorts } from '../../application/describe/describe_user.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class DescribeUserHttpAdapter extends HttpAdapter implements DescribeUserPorts {
	constructor(private readonly client: UserInfra, protected readonly bucket: BucketInfra) {
		super(bucket);
	}

	async describeUser({ env }: DescribeUserPorts.Input): Promise<DescribeUserPorts.Output> {
		const userResponse = await this.client.describeUser({ env });

		return {
			user: mapUserDbToApp(userResponse.user),
		};
	}

	async getUserImage({ key, env }: GetUserImagePorts.Input): Promise<GetUserImagePorts.Output> {
		return await this.getImageByKey({ key, env });
	}
}
