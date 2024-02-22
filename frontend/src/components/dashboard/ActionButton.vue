<script setup lang="ts">
import { EMITTER_NAMES, emitter } from '../../utils/emitter';

defineProps<{ text: string }>();

const onActionButtonClick = () => {
	emitter.emit(EMITTER_NAMES.toggleCreateProjectSection, true);
};
</script>

<template>
	<button
		type="button"
		@click="onActionButtonClick">
		<slot name="icon" />
		<p>{{ text }}</p>
	</button>
</template>

<style scoped>
button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	padding: 0.6rem 1.3rem;
	font-size: 1rem;
	border-radius: var(--border-radius);

	color: white;
	background-color: var(--contrast);
	border: 1px solid var(--contrast-dark);

	cursor: pointer;
	transition: all 0.2s ease;
}

button:hover {
	background-color: var(--contrast-dark);
}
</style>
