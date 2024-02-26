<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';
import { defineAsyncComponent, ref, onUnmounted, watch } from 'vue';
import { EMITTER_NAMES, MODAL_ACTIONS, emitter } from '../../../utils/emitter';
import type { Project } from '../../../api';

const isOpened = ref(false);
const modal = ref<HTMLElement>();
const modalComponent = ref<string | null>(null);
const projects = ref<Project[]>([]);
const project = ref<Project>();

const asyncComponents: Record<string, any> = {
	RemoveProjectModal: defineAsyncComponent(() => import('./RemoveProjectModal.vue')),
	CreateProjectModal: defineAsyncComponent(() => import('./CreateProjectModal.vue')),
	EditProjectModal: defineAsyncComponent(() => import('./EditProjectModal.vue')),
};

emitter.on(EMITTER_NAMES.modal, payload => {
	isOpened.value = true;

	if (typeof payload === 'object') {
		switch (payload.action) {
			case MODAL_ACTIONS.REMOVE:
				modalComponent.value = payload.componentName;
				projects.value = payload.projects;
				break;
			case MODAL_ACTIONS.CREATE:
				modalComponent.value = payload.componentName;
				break;
			case MODAL_ACTIONS.EDIT:
				modalComponent.value = payload.componentName;
				project.value = payload.project;
				break;
			case MODAL_ACTIONS.CLOSE:
				closeModal();
				break;
			default:
				break;
		}
	}
});

const closeModal = () => {
	modal.value?.classList.add('fadedown');

	setTimeout(() => {
		isOpened.value = false;
	}, 200);
};

const onPressEscKey = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		closeModal();
	}
};

watch(
	() => isOpened.value,
	isOpened => {
		if (isOpened) {
			window.addEventListener('keyup', onPressEscKey);
		}
	}
);

onUnmounted(() => {
	window.removeEventListener('keyup', onPressEscKey);
});
</script>

<template>
	<div
		class="backdrop"
		v-if="isOpened">
		<div
			ref="modal"
			class="modal"
			:class="{ fadeUp: isOpened }">
			<IconX
				class="icon-x"
				@click="closeModal" />
			<component
				v-if="modalComponent"
				:is="asyncComponents[modalComponent]"
				:projects="projects"
				:project="project"
				@close-modal="closeModal" />
		</div>
	</div>
</template>

<style scoped>
.backdrop {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;

	display: grid;
	place-items: center;
	z-index: 10;

	background-color: var(--backdrop);
}

.modal {
	position: relative;
	padding: 2rem;
	background-color: var(--bg-dropdown);
	box-shadow: var(--box-shadow);
	border-radius: var(--border-radius);

	animation: fadeup 0.2s ease forwards;
}

.fadedown {
	animation: fadedown 0.2s ease forwards;
}

.icon-x {
	position: absolute;
	left: 0.7rem;
	top: 0.7rem;
	color: var(--text-color);
	cursor: pointer;
	width: 1rem;
}
</style>
