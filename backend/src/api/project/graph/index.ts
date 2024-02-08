import { DescribeProjectHttpAdapter } from '../adapters/describe/describe_project.http_adapter';
import { DefaultProjectDescribeUsecases } from '../application/describe/project_describe.usecases';
import { DefaultProjectInfra } from '../infra/project_infra';

const projectInfra = new DefaultProjectInfra();
const projectDescribeAdapter = new DescribeProjectHttpAdapter(projectInfra);
export const projectDescribeUsecase = new DefaultProjectDescribeUsecases(projectDescribeAdapter);
