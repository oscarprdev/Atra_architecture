<script setup lang="ts">
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { ref } from 'vue';

const PROJECTS_BY_PAGE = 6;
const currentPage = ref(1);
const totalProjects = ref(0);

const onNextPageClick = () => {
	currentPage.value++;

	emitter.emit(EMITTER_NAMES.pagination, {
		totalProject: totalProjects.value,
		currentPage: currentPage.value,
		action: EMITT_ACTIONS.PAGINATION,
	});
};

const onPreviousPageClick = () => {
	currentPage.value--;

	emitter.emit(EMITTER_NAMES.pagination, {
		totalProject: totalProjects.value,
		currentPage: currentPage.value,
		action: EMITT_ACTIONS.PAGINATION,
	});
};

emitter.on(EMITTER_NAMES.pagination, async payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.NUM_PROJECTS) {
		totalProjects.value = payload.totalProject;
	} else if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.PAGINATION) {
		currentPage.value = payload.currentPage;
	}
});
</script>

<template>
	<div class="pagination">
		<button
			class="icon icon--left"
			:disabled="currentPage === 1"
			@click="onPreviousPageClick()">
			<IconArrowNarrowLeft width="17" />
		</button>

		<p>{{ currentPage }}</p>

		<button
			class="icon icon--right"
			:disabled="currentPage * PROJECTS_BY_PAGE > totalProjects"
			@click="onNextPageClick()">
			<IconArrowNarrowRight width="17" />
		</button>
	</div>
</template>

<style scoped>
.pagination {
	display: flex;
	align-items: center;
	gap: 5rem;
	width: auto;
}

.pagination p {
	margin: 0;
	padding: 0;
	color: var(--text-color);
	font-weight: 100;
}

.icon {
	display: grid;
	place-items: center;
	padding: 0 0.3rem;
}

.icon--left {
	margin-right: -4rem;
}

.icon--right {
	margin-left: -4rem;
}

button {
	border-radius: var(--border-radius);
	color: var(--text-color);
	font-size: 1rem;
	font-weight: 100;

	font-size: var(--font-small);

	background-color: var(--primary);
	border: 1px solid var(--primary-light);
}

button:disabled {
	color: var(--text-color-disabled);
}

button:hover:not(:disabled) {
	cursor: pointer;
	background-color: var(--primary-hover);
}
</style>
