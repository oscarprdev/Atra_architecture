import mitt from 'mitt';

type Events = {
    searchProject: string;
    toggleCreateProjectSection: boolean;
};

export const emitter = mitt<Events>();

export const EMITTER_NAMES: Record<keyof Events, keyof Events> = {
    searchProject: 'searchProject',
    toggleCreateProjectSection: 'toggleCreateProjectSection'
};
