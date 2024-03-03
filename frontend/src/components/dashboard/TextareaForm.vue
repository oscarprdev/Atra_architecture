<script setup lang="ts">
defineProps<{
	name: string;
	value: string;
	placeholder: string;
	title: string;
	maxLength: number;
	isBig?: boolean;
}>();

const emits = defineEmits<{
	(e: 'change', event: Event): void;
}>();
</script>

<template>
	<label :for="name">
		{{ title }}
		<textarea
			:class="{ isBig }"
			required
			:maxLength="maxLength"
			:placeholder="placeholder"
			:name="name"
			:value="value"
			@input="e => emits('change', e)"
		/>
	</label>
</template>

<style scoped>
label {
	display: flex;
	flex-direction: column;
	align-items: start;
	font-weight: bold;
	gap: 0.5rem;

	color: var(--text-color);
	font-size: var(--font-small);
}

input,
textarea {
	padding: 1rem;
	width: 100%;
	border: none;
	outline: none;
	font-weight: 200;
	font-family: 'Arimo', system-ui, sans-serif;
	max-width: 80ch;

	border: 1px solid var(--primary-light-hover);
	font-size: var(--font-small);
	border-radius: var(--border-radius);
	caret-color: var(--contrast);
	color: var(--text-color);
	background-color: var(--primary-hover);
	font-size: var(--font-small);

	transition: all 0.2s ease;
}

textarea {
	min-height: 100px;
	resize: none;
}

input::placeholder,
textarea::placeholder {
	font-size: var(--font-small);
	color: var(--text-color);
}

input:hover,
textarea:hover {
	background-color: var(--primary-light-hover);
}

input:focus-within,
textarea:focus-within {
	border: 1px solid var(--contrast);
}

.isBig {
	height: 200px;
}
</style>
