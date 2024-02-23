<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';
import { defineAsyncComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { MODAL_EMITTER_NAMES, modalEmitter } from '../../../utils/emitter';
import type { Project } from '../../../api';

const modal = ref<HTMLElement>();
const isOpened = ref(false);
const modalComponent = ref<string | null>(null);

const projects = ref<Project[]>([]);

const asyncComponents: Record<string, any> = {
	RemoveProjectModal: defineAsyncComponent(() => import('./RemoveProjectModal.vue')),
};

modalEmitter.on(MODAL_EMITTER_NAMES.showRemoveProjectModal, data => {
	isOpened.value = true;

	if (data.kind === 'remove') {
		modalComponent.value = data.componentName;
		projects.value = data.projects;
	}
});

const onClickOutside = (event: MouseEvent) => {
	if (modal.value && !modal.value.contains(event.target as Node)) {
		console.log('here');
		isOpened.value = false;
	}
};

const onPressEscKey = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		isOpened.value = false;
	}
};

watch(
	() => isOpened.value,
	isOpened => {
		if (isOpened) {
			console.log('helo');
			window.addEventListener('keyup', onPressEscKey);
			window.addEventListener('click', onClickOutside);
		}
	}
);

onUnmounted(() => {
	window.removeEventListener('keyup', onPressEscKey);
	window.removeEventListener('click', onClickOutside);
});
</script>

<template>
	<div
		class="backdrop"
		v-if="isOpened">
		<div
			class="modal"
			ref="modal">
			<IconX
				class="icon-x"
				@click="isOpened = false" />
			<component
				v-if="modalComponent"
				:is="asyncComponents[modalComponent]"
				:projects="projects" />
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

	background-color: rgba(0, 0, 0, 0.264);
}

.open {
	visibility: visible;
}

.modal {
	position: relative;
	padding: 2rem;
	background-color: var(--dropdown-bg-color);
	box-shadow: var(--box-shadow);
	border-radius: var(--border-radius);
}

.icon-x {
	position: absolute;
	left: 1rem;
	top: 1rem;
	color: var(--text-light);
	cursor: pointer;
}
</style>
