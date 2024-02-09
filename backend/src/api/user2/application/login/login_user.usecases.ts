import extractErrorInfo from '../../../../utils/extract_from_error_info';
import { User } from '../../../generated';
import { LoginUserPorts } from './login_user.ports';
import { LoginUserUsecasesTypes } from './login_user.types';
import jwt from '@tsndr/cloudflare-worker-jwt';

export interface LoginUserUsecases {
	loginUser(input: LoginUserUsecasesTypes.LoginUserInput): Promise<LoginUserUsecasesTypes.LoginUserOutput>;
}

export class DefaultLoginUserUsecases implements LoginUserUsecases {
	constructor(private readonly ports: LoginUserPorts) {}

	private hexStringToUint8Array(hexString?: string): Uint8Array {
		const hex = hexString || crypto.randomUUID().toString();

		const length = hex.length / 2;
		const uint8Array = new Uint8Array(length);

		for (let i = 0; i < length; i++) {
			const byte = parseInt(hex.substr(i * 2, 2), 16);
			uint8Array[i] = byte;
		}

		return uint8Array;
	}

	private async verifyPassword(inputPassword: string, hexSalt: string, hashedPassword: string): Promise<boolean> {
		const encoder = new TextEncoder();

		const inputPasswordBuffer = encoder.encode(inputPassword);

		const salt = this.hexStringToUint8Array(hexSalt);

		const saltedInputPassword = new Uint8Array(salt.length + inputPasswordBuffer.length);
		saltedInputPassword.set(salt, 0);
		saltedInputPassword.set(inputPasswordBuffer, salt.length);

		const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedInputPassword);

		const hashedInputPassword = Array.from(new Uint8Array(hashedBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

		return hashedInputPassword === hashedPassword;
	}

	async loginUser({ password, email, env }: LoginUserUsecasesTypes.LoginUserInput): Promise<LoginUserUsecasesTypes.LoginUserOutput> {
		try {
			const { name, passwordDb, emailDb } = await this.ports.selectUserAuthInfo({ env });

			const isPasswordValid = await this.verifyPassword(password, env.SALT, passwordDb);
			const isEmailValid = emailDb === email;

			if (!isPasswordValid || !isEmailValid) {
				throw new Error(
					JSON.stringify({
						status: 400,
						message: 'Email or password not valid',
					})
				);
			}

			const token = await jwt.sign({ name, email: emailDb }, env.SECRET);
			const isValid = await jwt.verify(token, env.SECRET);

			if (!isValid) {
				throw new Error(
					JSON.stringify({
						status: 500,
						message: 'Error creating JWT',
					})
				);
			}

			return {
				token,
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error logging user'}`,
				})
			);
		}
	}
}
