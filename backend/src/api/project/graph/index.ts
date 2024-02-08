import { CreateProjectHttpAdapter } from '../repository/create/create_project.http_adapter';
import { DeleteProjectHttpAdapter } from '../repository/delete/project_delete.http_adapter';
import { DescribeProjectHttpAdapter } from '../repository/describe/describe_project.http_adapter';
import { ListProjectHttpAdapter } from '../repository/list/project_list.http_adapter';
import { DefaultProjectCreateUsecases } from '../application/create/project_create.usecases';
import { DefaultProjectDeleteUsecases } from '../application/delete/project_delete.usecases';
import { DefaultProjectDescribeUsecases } from '../application/describe/project_describe.usecases';
import { DefaultProjectListUsecases } from '../application/list/project_list.usecases';
import { DefaultBucketInfra } from '../../shared/infra/bucket_infra';
import { DefaultProjectInfra } from '../infra/project_infra';

const projectInfra = new DefaultProjectInfra();
const bucketInfra = new DefaultBucketInfra();

// Describe project usecase dependency injection
const projectDescribeAdapter = new DescribeProjectHttpAdapter(projectInfra, bucketInfra);
export const projectDescribeUsecase = new DefaultProjectDescribeUsecases(projectDescribeAdapter);

// Create project usecase dependency injection
const projectCreateAdapter = new CreateProjectHttpAdapter(projectInfra, bucketInfra);
export const projectCreateUsecase = new DefaultProjectCreateUsecases(projectCreateAdapter);

// List project usecase dependency injection
const projectListAdapter = new ListProjectHttpAdapter(projectInfra, bucketInfra);
export const projectListUsecase = new DefaultProjectListUsecases(projectListAdapter);

// Delete project usecase dependency injection
const projectDeleteAdapter = new DeleteProjectHttpAdapter(projectInfra, bucketInfra);
export const projectDeleteUsecase = new DefaultProjectDeleteUsecases(projectDeleteAdapter);
