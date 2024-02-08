import { DefaultBucketInfra } from '../../shared/infra/bucket_infra';
import { DefaultDescribeUserUsecases } from '../application/describe/describe_user.usecases';
import { DefaultUserInfra } from '../infra/user_infra';
import { DescribeUserHttpAdapter } from '../repository/describe/describe_user.http_adapter';

const userInfra = new DefaultUserInfra();
const bucketInfra = new DefaultBucketInfra();

// Describe user usecase dependency injection
const describeUserAdapter = new DescribeUserHttpAdapter(userInfra, bucketInfra);
export const describeUserUsecase = new DefaultDescribeUserUsecases(describeUserAdapter);
