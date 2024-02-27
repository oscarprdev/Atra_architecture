<script setup lang="ts">
import { IconArrowsSort } from '@tabler/icons-vue';
import { emitter, EMITTER_NAMES, type SortKind, EMITT_ACTIONS } from '../../../utils/emitter';

defineProps<{
	text: string;
	kind: SortKind;
}>();

const onSortClick = (kind: SortKind) => {
	emitter.emit(EMITTER_NAMES.sort, { action: EMITT_ACTIONS.SORT, kind });
};
</script>

<template>
	<button
		class="sort"
		@click="onSortClick(kind)">
		<p>{{ text }}</p>
		<IconArrowsSort width="17" />
	</button>
</template>

<style scoped>
.sort {
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.2rem;
}

button {
	border-radius: var(--border-radius);
	color: var(--text-color);
	font-size: 1rem;
	font-weight: 100;
	cursor: pointer;

	font-size: var(--font-small);

	background-color: var(--primary);
	border: 1px solid var(--primary-light);
}

button:hover {
	background-color: var(--primary-hover);
}
</style>
