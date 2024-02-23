import mitt from 'mitt';
import type { Project } from '../api';

type Events = {
	searchProject: string;
	error: string;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	error: 'error',
};

interface CreateProjectPayload {
	componentName: string;
	kind: 'create';
	id: string;
}

interface RemoveProjectsPayload {
	componentName: string;
	projects: Project[];
	kind: 'remove';
}

type ModalEvents = {
	showCreateProjectSection: CreateProjectPayload;
	showRemoveProjectModal: RemoveProjectsPayload;
};

export const MODAL_EMITTER_NAMES: Record<keyof ModalEvents, keyof ModalEvents> = {
	showCreateProjectSection: 'showCreateProjectSection',
	showRemoveProjectModal: 'showRemoveProjectModal',
};

export const modalEmitter = mitt<ModalEvents>();
