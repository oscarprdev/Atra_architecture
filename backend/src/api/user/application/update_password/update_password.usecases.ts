import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { AuthUsecases } from '../../shared/auth.usecases';
import { UpdatePasswordPorts } from './update_password.ports';
import { UpdatePasswordUsecasesTypes } from './update_password.types';

export interface UpdatePasswordUsecases {
	updatePassword(input: UpdatePasswordUsecasesTypes.UpdatePasswordInput): Promise<void>;
	validatePassword(input: UpdatePasswordUsecasesTypes.ValidatePasswordInput): Promise<boolean>;
}

export class DefaultUpdatePasswordUsecases extends AuthUsecases implements UpdatePasswordUsecases {
	constructor(private readonly ports: UpdatePasswordPorts) {
		super();
	}

	async validatePassword({ env, oldPassword }: UpdatePasswordUsecasesTypes.ValidatePasswordInput) {
		try {
			const { passwordHashed } = await this.ports.selectUserPassword({ env });

			const isValid = await this.verifyPassword(oldPassword, env.SALT, passwordHashed);

			return isValid;
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error validant contrasenya'}`,
				})
			);
		}
	}

	async updatePassword({ env, oldPassword, newPassword }: UpdatePasswordUsecasesTypes.UpdatePasswordInput): Promise<void> {
		try {
			const { userId, passwordHashed } = await this.ports.selectUserPassword({ env });

			const isValid = await this.verifyPassword(oldPassword, env.SALT, passwordHashed);

			if (!isValid) {
				throw new Error(
					JSON.stringify({
						status: 400,
						message: 'La contrasenya no es correcta',
					})
				);
			}

			const hashedPassword = await this.hashPassword(newPassword, env.SALT);

			await this.ports.updatePassword({ id: userId, hashedPassword, env });
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error actualitzant contrasenya'}`,
				})
			);
		}
	}
}
