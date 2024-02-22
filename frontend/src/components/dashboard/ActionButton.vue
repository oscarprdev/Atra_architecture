<script setup lang="ts">
defineProps<{ text: string }>();

const emits = defineEmits<{
	(e: 'on-action-click'): void;
}>();
</script>

<template>
	<button
		type="button"
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
