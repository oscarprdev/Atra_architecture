import { DefaultBucketInfra } from '../../shared/infra/bucket_infra';
import { DefaultDescribeUserUsecases } from '../application/describe/describe_user.usecases';
import { DefaultLoginUserUsecases } from '../application/login/login_user.usecases';
import { DefaultUpdateUserUsecases } from '../application/update/update_user.usecases';
import { DefaultUserInfra } from '../infra/user_infra';
import { DescribeUserHttpAdapter } from '../repository/describe/describe_user.http_adapter';
import { LoginUserHttpAdapter } from '../repository/login/login_user.http_adapter';
import { UpdateUserHttpAdapter } from '../repository/update/update_user.http_adapter';

const userInfra = new DefaultUserInfra();
const bucketInfra = new DefaultBucketInfra();

// Describe user usecase dependency injection
const describeUserAdapter = new DescribeUserHttpAdapter(userInfra, bucketInfra);
export const describeUserUsecase = new DefaultDescribeUserUsecases(describeUserAdapter);

// Login user usecase dependency injection
const loginUserAdapter = new LoginUserHttpAdapter(userInfra);
export const loginUserUsecase = new DefaultLoginUserUsecases(loginUserAdapter);

// Update user usecase dependency injection
const updateUserAdapter = new UpdateUserHttpAdapter(userInfra, bucketInfra);
export const updateUserUsecase = new DefaultUpdateUserUsecases(updateUserAdapter);
