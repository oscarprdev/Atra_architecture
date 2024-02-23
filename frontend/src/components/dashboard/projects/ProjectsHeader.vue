<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';

const onCreateProjectClick = () => {
	// emitter.emit(EMITTER_NAMES.showCreateProjectSection, true);
};
</script>

<template>
	<header>
		<InputSearch />
		<ActionButton
			text="Nou projecte"
			@on-action-click="onCreateProjectClick">
			<template #icon>
				<IconPlus />
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
