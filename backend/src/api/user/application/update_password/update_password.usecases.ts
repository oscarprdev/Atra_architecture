import extractErrorInfo from '../../../../utils/extract_from_error_info';
import { UserUsecases } from '../../shared/user.usecases';
import { UpdatePasswordPorts } from './update_password.ports';
import { UpdatePasswordUsecasesTypes } from './update_password.types';

export interface UpdatePasswordUsecases {
	updatePassword(input: UpdatePasswordUsecasesTypes.UpdatePasswordInput): Promise<void>;
}

export class DefaultUpdatePasswordUsecases extends UserUsecases implements UpdatePasswordUsecases {
	constructor(private readonly ports: UpdatePasswordPorts) {
		super();
	}

	private async hashPassword(password: string, hexSalt: string): Promise<string> {
		const encoder = new TextEncoder();

		const passwordBuffer = encoder.encode(password);

		const salt = this.hexStringToUint8Array(hexSalt);

		const saltedPassword = new Uint8Array(salt.length + passwordBuffer.length);
		saltedPassword.set(salt, 0);
		saltedPassword.set(passwordBuffer, salt.length);

		const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);

		const hashedPassword = Array.from(new Uint8Array(hashedBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

		return hashedPassword;
	}

	async updatePassword({ env, oldPassword, newPassword }: UpdatePasswordUsecasesTypes.UpdatePasswordInput): Promise<void> {
		try {
			const { userId, passwordHashed } = await this.ports.selectUserPassword({ env });

			const isValid = await this.verifyPassword(oldPassword, env.SALT, passwordHashed);

			if (!isValid) {
				throw new Error(
					JSON.stringify({
						status: 400,
						message: 'Password not valid',
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
					message: `${error instanceof Error ? message : 'Error updating password'}`,
				})
			);
		}
	}
}
