<script setup lang="ts">
import { ButtonKinds, BUTTON_KINDS } from './ActionButton.types';

defineProps<{
	text: string;
	disabled?: boolean;
	type?: 'button' | 'submit';
	kind: ButtonKinds.PRIMARY | ButtonKinds.SECONDARY | ButtonKinds.DANGER;
}>();

const emits = defineEmits<{
	(e: 'on-action-click'): void;
}>();
</script>

<template>
	<button
		:disabled="disabled"
		:class="{
			primary: kind === BUTTON_KINDS.PRIMARY,
			secondary: kind === BUTTON_KINDS.SECONDARY,
			danger: kind === BUTTON_KINDS.DANGER,
		}"
		:type="type || 'button'"
		@click="emits('on-action-click')">
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
	min-width: 100px;

	border-radius: var(--border-radius);
	font-size: var(--font-small);

	cursor: pointer;
	transition: all 0.2s ease;

	padding: 0 1.3rem;
	height: 3rem;
}

.primary {
	font-size: 1rem;
	color: white;
	background-color: var(--contrast);
	border: 1px solid var(--contrast-dark);
}

.secondary {
	border: 1px solid var(--border-dropdown);
	background-color: var(--bg-dropdown);
	color: var(--text-color);
}

.danger {
	border: 1px solid red;
	background-color: rgba(255, 0, 0, 0.696);

	color: white;
}

.danger:hover {
	background-color: rgb(255, 52, 52);
}

.danger:disabled {
	cursor: auto;
	border: 1px solid var(--text-color-disabled);
	background-color: var(--primary-hover);
}

.primary:hover {
	background-color: var(--contrast-dark);
}

.secondary:hover {
	background-color: var(--primary-hover);
}

button:disabled {
	color: var(--text-color-disabled);
}
</style>
