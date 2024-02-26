import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { DescribeUserPorts } from './describe_user.ports';
import { DescribeUserUsecaseTypes } from './describe_user.types';

export interface DescribeUserUsecases {
	describeUser(input: DescribeUserUsecaseTypes.Input): Promise<DescribeUserUsecaseTypes.Output>;
}

export class DefaultDescribeUserUsecases implements DescribeUserUsecases {
	constructor(private readonly ports: DescribeUserPorts) {}

	async describeUser({ env }: DescribeUserUsecaseTypes.Input): Promise<DescribeUserUsecaseTypes.Output> {
		try {
			const userResponse = await this.ports.describeUser({ env });
			const userImage = await this.ports.getUserImage({ key: userResponse.user.imageKey, env });

			return {
				user: {
					...userResponse.user,
					image: `personal/${userImage.image.name}`,
				},
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error retrieving user'}`,
				})
			);
		}
	}
}
