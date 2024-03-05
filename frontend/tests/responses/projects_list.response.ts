import type { Project } from '../../src/pages/api/generated';
import { projectResponse } from './project_response';

export const projectListResponse: { data: Project[] } = {
	data: [projectResponse, projectResponse],
};
