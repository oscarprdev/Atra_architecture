import mitt from 'mitt';
import type { Project } from '../api';

type Events = {
	searchProject: string;
	getProjects: boolean;
	error: string;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	getProjects: 'getProjects',
	error: 'error',
};

export enum ModalActions {
	CREATE = 'CREATE',
	REMOVE = 'REMOVE',
	CLOSE = 'CLOSE',
}

export const MODAL_ACTIONS = {
	CREATE: 'CREATE' as ModalActions.CREATE,
	REMOVE: 'REMOVE' as ModalActions.REMOVE,
	CLOSE: 'CLOSE' as ModalActions.CLOSE,
};

interface CreateProjectPayload {
	componentName: string;
	action: ModalActions.CREATE;
	id: string;
}

interface RemoveProjectsPayload {
	componentName: string;
	projects: Project[];
	action: ModalActions.REMOVE;
}

interface CloseRemoveProjectModal {
	action: ModalActions.CLOSE;
}

type ModalEvents = {
	showCreateProjectSection: CreateProjectPayload;
	showRemoveProjectModal: RemoveProjectsPayload;
	closeRemoveProjectModal: CloseRemoveProjectModal;
};

export const MODAL_EMITTER_NAMES: Record<keyof ModalEvents, keyof ModalEvents> = {
	showCreateProjectSection: 'showCreateProjectSection',
	showRemoveProjectModal: 'showRemoveProjectModal',
	closeRemoveProjectModal: 'closeRemoveProjectModal',
};

export const modalEmitter = mitt<ModalEvents>();
