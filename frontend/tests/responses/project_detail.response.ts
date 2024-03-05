import type { Project } from '../../src/pages/api/generated';
import { projectResponse } from './project_response';

export const projectDetailResponse: { data: Project } = {
	data: projectResponse,
};
