import mitt from 'mitt';
import type { Project } from '../api';

export enum EmittActions {
	CREATE = 'CREATE',
	REMOVE = 'REMOVE',
	EDIT = 'EDIT',
	CLOSE = 'CLOSE',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	SORT = 'SORT',
}

export const EMITT_ACTIONS = {
	CREATE: 'CREATE' as EmittActions.CREATE,
	REMOVE: 'REMOVE' as EmittActions.REMOVE,
	EDIT: 'EDIT' as EmittActions.EDIT,
	CLOSE: 'CLOSE' as EmittActions.CLOSE,
	SUCCESS: 'SUCCESS' as EmittActions.SUCCESS,
	ERROR: 'ERROR' as EmittActions.ERROR,
	SORT: 'SORT' as EmittActions.SORT,
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

interface CloseModal {
	action: EmittActions.CLOSE;
}

interface Success {
	action: EmittActions.SUCCESS;
}

interface Error {
	action: EmittActions.ERROR;
	message: string;
}

interface Sort {
	action: EmittActions.SORT;
	kind: 'year' | 'top';
}

type Events = {
	searchProject: string;
	getProjects: boolean;
	modal: CreateProjectPayload | RemoveProjectsPayload | EditProjectPayload | CloseModal;
	success: Success;
	error: Error;
	sort: Sort;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	getProjects: 'getProjects',
	modal: 'modal',
	success: 'success',
	error: 'error',
	sort: 'sort',
};
