<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
	name: string;
	value: string;
	type: string;
	placeholder: string;
	title: string;
	options?: Record<string, any>;
}>();
const input = ref<HTMLInputElement>();
const emits = defineEmits<{
	(e: 'input', event: Event): void;
}>();

onMounted(() => {
	if (props.options) {
		Object.entries(props.options).forEach(([key, value]) => {
			input.value?.setAttribute(key, value);
		});
	}
});
</script>

<template>
	<label :for="name">
		{{ title }}
		<input
			ref="input"
			required
			:placeholder="placeholder"
			:type="type"
			:name="name"
			:value="value"
			@change="e => emits('input', e)" />
	</label>
</template>

<style scoped>
label {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem;

	font-weight: bold;
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
</style>
