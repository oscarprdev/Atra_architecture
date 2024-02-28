import { imagesUsecases } from '../../images/graph';
import { DefaultCreateUserUsecases } from '../application/create/create_user.usecases';
import { DefaultDescribeUserUsecases } from '../application/describe/describe_user.usecases';
import { DefaultLoginUserUsecases } from '../application/login/login_user.usecases';
import { DefaultUpdateUserUsecases } from '../application/update/update_user.usecases';
import { DefaultUpdatePasswordUsecases } from '../application/update_password/update_password.usecases';
import { ValidateAuthUsecase } from '../application/validate_auth/validate_auth.usecase';
import { DefaultUserInfra } from '../infra/user_infra';
import { CreateUserHttpAdapter } from '../repository/create/create_user.http_adapter';
import { DescribeUserHttpAdapter } from '../repository/describe/describe_user.http_adapter';
import { LoginUserHttpAdapter } from '../repository/login/login_user.http_adapter';
import { UpdateUserHttpAdapter } from '../repository/update/update_user.http_adapter';
import { UpdatePasswordHttpAdapter } from '../repository/update_password/update_password.http_adapter';

const userInfra = new DefaultUserInfra();

// Describe user usecase dependency injection
const describeUserAdapter = new DescribeUserHttpAdapter(userInfra, imagesUsecases);
export const describeUserUsecase = new DefaultDescribeUserUsecases(describeUserAdapter);

// Login user usecase dependency injection
const loginUserAdapter = new LoginUserHttpAdapter(userInfra);
export const loginUserUsecase = new DefaultLoginUserUsecases(loginUserAdapter);

// Update user usecase dependency injection
const updateUserAdapter = new UpdateUserHttpAdapter(userInfra, imagesUsecases);
export const updateUserUsecase = new DefaultUpdateUserUsecases(updateUserAdapter);

// Create user usecase dependency injection
const createUserAdapter = new CreateUserHttpAdapter(userInfra, imagesUsecases);
export const createUserUsecase = new DefaultCreateUserUsecases(createUserAdapter);

// Update password usecase dependency injection
const updatePasswordAdapter = new UpdatePasswordHttpAdapter(userInfra);
export const updatePasswordUsecase = new DefaultUpdatePasswordUsecases(updatePasswordAdapter);

// Validate auth dependency injection
export const validateAuthUsecase = new ValidateAuthUsecase();
