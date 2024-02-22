import mitt from 'mitt';

type Events = {
	searchProject: string;
	showCreateProjectSection: boolean;
	showRemoveProjectModal: boolean;
	showHeaderActionButtons: boolean;
	error: string;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	showCreateProjectSection: 'showCreateProjectSection',
	showRemoveProjectModal: 'showRemoveProjectModal',
	showHeaderActionButtons: 'showHeaderActionButtons',
	error: 'error',
};
