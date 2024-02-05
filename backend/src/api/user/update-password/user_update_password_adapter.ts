import { Env } from '../../..';
import updatePasswordUserInfra from './infra/user_update_password_infra';
import { UserPasswordUpdateInput } from './user_update_password_types';

async function updatePasswordUserAdapter(input: UserPasswordUpdateInput, env: Env): Promise<boolean> {
	await updatePasswordUserInfra(input, env);

	return true;
}

export default updatePasswordUserAdapter;
