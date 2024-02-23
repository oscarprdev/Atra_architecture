<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { EMITTER_NAMES, MODAL_ACTIONS, emitter } from '../../../utils/emitter';

const onCreateProjectClick = () => {
	emitter.emit(EMITTER_NAMES.modal, { action: MODAL_ACTIONS.CREATE, componentName: 'CreateProjectModal' });
};
</script>

<template>
	<header>
		<InputSearch />
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
</style>
