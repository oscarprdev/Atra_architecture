<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { IconArrowsSort } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';

const onCreateProjectClick = () => {
	emitter.emit(EMITTER_NAMES.modal, { action: EMITT_ACTIONS.CREATE, componentName: 'CreateProjectModal' });
};

const onSortClick = (kind: 'year' | 'top' | 'date') => {
	emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind });
};
</script>

<template>
	<header>
		<div class="filters">
			<InputSearch />
			<button
				class="sort"
				@click="onSortClick('top')">
				<p>Destacat</p>
				<IconArrowsSort width="17" />
			</button>
			<button
				class="sort"
				@click="onSortClick('year')">
				<p>Any</p>
				<IconArrowsSort width="17" />
			</button>
			<button
				class="sort"
				@click="onSortClick('date')">
				<p>Actualizat</p>
				<IconArrowsSort width="17" />
			</button>
		</div>

		<ActionButton
			:kind="BUTTON_KINDS.PRIMARY"
			text="Nou projecte"
			@on-action-click="onCreateProjectClick">
			<template #icon>
				<IconPlus width="18" />
			</template>
		</ActionButton>
	</header>
</template>

<style>
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 2rem;
	background-color: var(--primary);
	width: 100%;
	border-radius: var(--border-radius);
	border-top-right-radius: 0;
}

.filters {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.sort {
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.2rem;
}

button {
	border: var(--border-radius);
	color: var(--text-color);
	font-size: 1rem;
	font-weight: 100;

	font-size: var(--font-small);

	background-color: var(--primary);
	border: 1px solid var(--primary-light);
}

button:hover {
	background-color: var(--primary-hover);
}
</style>
