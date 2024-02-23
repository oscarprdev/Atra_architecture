import mitt from 'mitt';
import type { Project } from '../api';

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
}

interface RemoveProjectsPayload {
	componentName: string;
	projects: Project[];
	action: ModalActions.REMOVE;
}

interface CloseRemoveProjectModal {
	action: ModalActions.CLOSE;
}

type Events = {
	searchProject: string;
	getProjects: boolean;
	modal: CreateProjectPayload | RemoveProjectsPayload | CloseRemoveProjectModal;
	error: string;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	getProjects: 'getProjects',
	modal: 'modal',
	error: 'error',
};
