<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import Pagination from './Pagination.vue';
import Dropdown from '../Dropdown.vue';
import type { Option } from '../Dropdown.types';

const onCreateProjectClick = () => {
	emitter.emit(EMITTER_NAMES.modal, {
		action: EMITT_ACTIONS.CREATE,
		componentName: 'CreateProjectModal',
	});
};

const actionDropdownOptions: Option[] = [
	{
		label: 'Destacats',
		cb: () => emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind: 'top' }),
	},
	{
		label: 'Nous projectes',
		cb: () => emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind: 'year' }),
	},
	{
		label: 'Ultims actualitzats',
		cb: () => emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind: 'date' }),
	},
	{
		label: 'Per defecte',
		cb: () => emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind: 'default' }),
	},
];
</script>

<template>
	<header data-testid="dashboard-header">
		<div class="filters">
			<InputSearch />
			<Dropdown
				:options="actionDropdownOptions"
				default-text="Ordenar"
			/>
			<Pagination />
		</div>

		<ActionButton
			data-testid="create-project-button"
			:kind="BUTTON_KINDS.PRIMARY"
			text="Nou projecte"
			@on-action-click="onCreateProjectClick"
		>
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
