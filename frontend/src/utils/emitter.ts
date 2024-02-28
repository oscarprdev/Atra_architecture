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
	PAGINATION = 'PAGINATION',
	NUM_PROJECTS = 'NUM_PROJECTS',
	DROPDOWN = 'DROPDOWN',
}

export const EMITT_ACTIONS = {
	CREATE: 'CREATE' as EmittActions.CREATE,
	REMOVE: 'REMOVE' as EmittActions.REMOVE,
	EDIT: 'EDIT' as EmittActions.EDIT,
	CLOSE: 'CLOSE' as EmittActions.CLOSE,
	SUCCESS: 'SUCCESS' as EmittActions.SUCCESS,
	ERROR: 'ERROR' as EmittActions.ERROR,
	SORT: 'SORT' as EmittActions.SORT,
	PAGINATION: 'PAGINATION' as EmittActions.PAGINATION,
	NUM_PROJECTS: 'NUM_PROJECTS' as EmittActions.NUM_PROJECTS,
	DROPDOWN: 'DROPDOWN' as EmittActions.DROPDOWN,
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

export type SortKind = 'year' | 'top' | 'date' | 'default';

interface Sort {
	action: EmittActions.SORT;
	kind: SortKind;
}

interface Pagination {
	totalProject: number;
	currentPage: number;
	action: EmittActions.PAGINATION | EmittActions.NUM_PROJECTS;
}

type Events = {
	searchProject: string;
	sort: Sort;
	pagination: Pagination;
	dropdown: boolean;
	modal: CreateProjectPayload | RemoveProjectsPayload | EditProjectPayload | CloseModal;
	success: Success;
	error: Error;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	sort: 'sort',
	pagination: 'pagination',
	dropdown: 'dropdown',
	modal: 'modal',
	success: 'success',
	error: 'error',
};
