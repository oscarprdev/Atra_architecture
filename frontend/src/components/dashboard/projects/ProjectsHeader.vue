<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import SortButton from './SortButton.vue';
import Pagination from './Pagination.vue';

const onCreateProjectClick = () => {
	emitter.emit(EMITTER_NAMES.modal, { action: EMITT_ACTIONS.CREATE, componentName: 'CreateProjectModal' });
};
</script>

<template>
	<header>
		<div class="filters">
			<InputSearch />
			<SortButton
				text="Destacat"
				kind="top" />
			<SortButton
				text="Any"
				kind="year" />
			<SortButton
				text="Actualitzat"
				kind="date" />
			<Pagination />
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

<style scoped>
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
	justify-content: start;
	gap: 1rem;
}
</style>
