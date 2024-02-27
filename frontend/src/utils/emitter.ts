import mitt from 'mitt';
import type { Project } from '../api';

export enum EmittActions {
	CREATE = 'CREATE',
	REMOVE = 'REMOVE',
	EDIT = 'EDIT',
	CLOSE = 'CLOSE',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export const EMITT_ACTIONS = {
	CREATE: 'CREATE' as EmittActions.CREATE,
	REMOVE: 'REMOVE' as EmittActions.REMOVE,
	EDIT: 'EDIT' as EmittActions.EDIT,
	CLOSE: 'CLOSE' as EmittActions.CLOSE,
	SUCCESS: 'SUCCESS' as EmittActions.SUCCESS,
	ERROR: 'ERROR' as EmittActions.ERROR,
};

interface CreateProjectPayload {
	componentName: string;
	action: EmittActions.CREATE;
}

interface RemoveProjectsPayload {
	componentName: string;
	projects: Project[];
	action: EmittActions.REMOVE;
}

interface EditProjectPayload {
	componentName: string;
	project: Project;
	action: EmittActions.EDIT;
}

interface CloseRemoveProjectModal {
	action: EmittActions.CLOSE;
}

interface Success {
	action: EmittActions.SUCCESS;
}

interface Error {
	action: EmittActions.ERROR;
	message: string;
}

type Events = {
	searchProject: string;
	getProjects: boolean;
	modal: CreateProjectPayload | RemoveProjectsPayload | CloseRemoveProjectModal | EditProjectPayload;
	success: Success;
	error: Error;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	getProjects: 'getProjects',
	modal: 'modal',
	success: 'success',
	error: 'error',
};
