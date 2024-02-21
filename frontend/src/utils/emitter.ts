import mitt from 'mitt';

type Events = {
	searchProject: string;
	toggleCreateProjectSection: boolean;
	error: string;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
	searchProject: 'searchProject',
	toggleCreateProjectSection: 'toggleCreateProjectSection',
	error: 'error',
};
