import { LoginUserPorts, SelectUserAuthInfoPortsTypes } from '../../application/login/login_user.ports';
import { UserInfra } from '../../infra/user_infra';

export class LoginUserHttpAdapter implements LoginUserPorts {
	constructor(private readonly client: UserInfra) {}

	async selectUserAuthInfo({ env }: SelectUserAuthInfoPortsTypes.Input): Promise<SelectUserAuthInfoPortsTypes.Output> {
		const { user } = await this.client.describeUser({ env });

		return {
			name: user.name,
			emailDb: user.email,
			passwordDb: user.password_hash,
		};
	}
}
