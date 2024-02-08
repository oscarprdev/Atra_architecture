import { CreateProjectHttpAdapter } from '../adapters/create/create_project.http_adapter';
import { DescribeProjectHttpAdapter } from '../adapters/describe/describe_project.http_adapter';
import { DefaultProjectCreateUsecases } from '../application/create/project_create.usecases';
import { DefaultProjectDescribeUsecases } from '../application/describe/project_describe.usecases';
import { DefaultBucketInfra } from '../infra/bucket_infra';
import { DefaultProjectInfra } from '../infra/project_infra';

const projectInfra = new DefaultProjectInfra();
const bucketInfra = new DefaultBucketInfra();

// Describe project usecase dependency injection
const projectDescribeAdapter = new DescribeProjectHttpAdapter(projectInfra, bucketInfra);
export const projectDescribeUsecase = new DefaultProjectDescribeUsecases(projectDescribeAdapter);

// Create project usecase dependency injection
const projectCreateAdapter = new CreateProjectHttpAdapter(projectInfra, bucketInfra);
export const projectCreateUsecase = new DefaultProjectCreateUsecases(projectCreateAdapter);
