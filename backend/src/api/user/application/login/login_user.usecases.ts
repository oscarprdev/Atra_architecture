import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { AuthUsecases } from '../../shared/auth.usecases';
import { LoginUserPorts } from './login_user.ports';
import { LoginUserUsecasesTypes } from './login_user.types';
import jwt from '@tsndr/cloudflare-worker-jwt';

export interface LoginUserUsecases {
	loginUser(input: LoginUserUsecasesTypes.LoginUserInput): Promise<LoginUserUsecasesTypes.LoginUserOutput>;
}

export class DefaultLoginUserUsecases extends AuthUsecases implements LoginUserUsecases {
	constructor(private readonly ports: LoginUserPorts) {
		super();
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
