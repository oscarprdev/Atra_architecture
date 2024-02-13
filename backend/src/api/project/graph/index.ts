import { CreateProjectHttpAdapter } from '../repository/create/create_project.http_adapter';
import { DeleteProjectHttpAdapter } from '../repository/delete/project_delete.http_adapter';
import { DescribeProjectHttpAdapter } from '../repository/describe/describe_project.http_adapter';
import { ListProjectHttpAdapter } from '../repository/list/project_list.http_adapter';
import { DefaultProjectCreateUsecases } from '../application/create/project_create.usecases';
import { DefaultProjectDeleteUsecases } from '../application/delete/project_delete.usecases';
import { DefaultProjectDescribeUsecases } from '../application/describe/project_describe.usecases';
import { DefaultProjectListUsecases } from '../application/list/project_list.usecases';
import { DefaultProjectInfra } from '../infra/project_infra';
import { imagesUsecases } from '../../images/graph';
import { UpdateProjectHttpAdapter } from '../repository/update/update_project.http_adapter';
import { DefaultUpdateProjectUsecase } from '../application/update/update_project.usecase';

const projectInfra = new DefaultProjectInfra();

// Describe project usecase dependency injection
const projectDescribeAdapter = new DescribeProjectHttpAdapter(projectInfra, imagesUsecases);
export const projectDescribeUsecase = new DefaultProjectDescribeUsecases(projectDescribeAdapter);

// Create project usecase dependency injection
const projectCreateAdapter = new CreateProjectHttpAdapter(projectInfra, imagesUsecases);
export const projectCreateUsecase = new DefaultProjectCreateUsecases(projectCreateAdapter);

// List project usecase dependency injection
const projectListAdapter = new ListProjectHttpAdapter(projectInfra, imagesUsecases);
export const projectListUsecase = new DefaultProjectListUsecases(projectListAdapter);

// Delete project usecase dependency injection
const projectDeleteAdapter = new DeleteProjectHttpAdapter(projectInfra, imagesUsecases);
export const projectDeleteUsecase = new DefaultProjectDeleteUsecases(projectDeleteAdapter);

// Update project usecase dependency injection
const projectUpdateAdapter = new UpdateProjectHttpAdapter(projectInfra, imagesUsecases);
export const projectUpdateUsecase = new DefaultUpdateProjectUsecase(projectUpdateAdapter);
