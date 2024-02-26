import extractErrorInfo from '../../../shared/utils/extract_from_error_info';
import { ValidateAuthUsecasesTypes } from './validate_auth.types';
import jwt from '@tsndr/cloudflare-worker-jwt';

export interface ValidateAuth {
	validateAuth(input: ValidateAuthUsecasesTypes.ValidateAuthInput): Promise<ValidateAuthUsecasesTypes.ValidateAuthOutput>;
}

export class ValidateAuthUsecase implements ValidateAuth {
	constructor() {}

	async validateAuth(input: ValidateAuthUsecasesTypes.ValidateAuthInput) {
		try {
			const isValid = await jwt.verify(input.token, input.env.SECRET);

			if (!isValid) {
				throw new Error(
					JSON.stringify({
						status: 500,
						message: 'Error creating JWT',
					})
				);
			}

			return {
				token: input.token,
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `${error instanceof Error ? message : 'Error authenticating user'}`,
				})
			);
		}
	}
}
