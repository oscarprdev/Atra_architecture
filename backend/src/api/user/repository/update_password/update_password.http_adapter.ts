import { SelectUserPasswordPorts, UpdatePasswordPorts } from '../../application/update_password/update_password.ports';
import { UserInfra } from '../../infra/user_infra';
import { mapUserDbToApp } from '../shared/mappers/mapUseDbToApp';

export class UpdatePasswordHttpAdapter implements UpdatePasswordPorts {
	constructor(private readonly client: UserInfra) {}

	async selectUserPassword({ env }: SelectUserPasswordPorts.Input): Promise<SelectUserPasswordPorts.Output> {
		const response = await this.client.describeUser({ env });

		return {
			userId: response.user.user_id,
			passwordHashed: response.user.password_hash,
		};
	}

	async updatePassword({ id, hashedPassword, env }: UpdatePasswordPorts.Input): Promise<UpdatePasswordPorts.Output> {
		const response = await this.client.updatePassword({ userId: id, hashedPassword, env });

		return {
			user: mapUserDbToApp(response.user),
		};
	}
}
