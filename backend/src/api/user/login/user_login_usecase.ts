import { Env } from '../../..';
import verifyPassword from '../../../utils/verify_password';
import selectUserFromDb from '../common/user_infra';
import { userLoginInfra } from './infra/user_login_infra';
import { UserLoginInput } from './user_login_types';
import jwt from '@tsndr/cloudflare-worker-jwt';

async function userLoginUsecase(input: UserLoginInput, env: Env): Promise<string> {
	const userdb = await userLoginInfra(selectUserFromDb, env, null);
	const isPasswordValid = verifyPassword(input.password, env.SALT, userdb.password_hash);
	const isEmailValid = userdb.email === input.email;

	if (!isPasswordValid || !isEmailValid) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: 'Email or password not valid',
			})
		);
	}

	const token = await jwt.sign({ name: userdb.name, email: userdb.email }, env.SECRET);
	const isValid = await jwt.verify(token, env.SECRET);

	if (!isValid) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: 'Error creating JWT',
			})
		);
	}

	return token;
}

export default userLoginUsecase;
