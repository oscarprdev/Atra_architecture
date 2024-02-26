<script setup lang="ts">
import { ref } from 'vue';
import ProjectModal from './ProjectModal.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import ProjectsTable from './ProjectsTable.vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import ErrorToast from '../ErrorToast.vue';

const error = ref<string>();

emitter.on(EMITTER_NAMES.error, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.ERROR) {
		error.value = payload.message;

		setTimeout(() => {
			error.value = undefined;
		}, 5000);
	}
});
</script>

<template>
	<ProjectsHeader />
	<section>
		<ProjectsTable />
	</section>
	<ProjectModal />
	<ErrorToast
		v-if="error"
		:error="error" />
</template>

<style>
section {
	border-radius: var(--border-radius);
	box-sizing: border-box;
	height: 100%;
	width: 100%;
	background-color: var(--primary);
	overflow-y: auto;
}
</style>
