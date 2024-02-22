<script setup lang="ts">
import { ref } from 'vue';
import type { Option } from './Dropdown.types';
import { IconChevronUp } from '@tabler/icons-vue';

const props = defineProps<{
	options: Option[];
	defaultText: string;
}>();

const isOpen = ref(false);
const selectedOption = ref<string | null>(null);
const options = ref<Option[]>(props.options);

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
	selectedOption.value = option.label;
	isOpen.value = false;

	const optionToPerform = options.value.find(op => op.label === option.label);
	optionToPerform?.cb();
};
</script>

<template>
	<div class="dropdown">
		<button @click="toggleDropdown">
			<p>{{ selectedOption || props.defaultText }}</p>
			<IconChevronUp
				class="icon"
				:class="{ rotate: isOpen }" />
		</button>
		<ul
			:aria-checked="isOpen"
			class="dropdown-menu">
			<li
				v-for="option in options"
				:key="option.label"
				@click="selectOption(option)">
				{{ option.label }}
			</li>
		</ul>
	</div>
</template>

<style scoped>
.dropdown {
	position: relative;
	display: inline-block;

	width: 120px;
}

.icon {
	width: 1rem;

	transition: transform 0.2s linear;
}

.rotate {
	transform: rotate(180deg);
}

button {
	display: flex;
	justify-content: center;
	align-items: center;

	gap: 0.5rem;
	padding: 0.5rem 1.2rem;
	border-radius: 0.3rem;
	min-width: 120px;

	border: none;
	background-color: var(--dropdown-bg-color);
	color: var(--dropdown-text-color);
}

.dropdown-menu {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;

	padding: 0.5rem;
	margin-top: 0.5rem;
	min-width: 120px;

	background-color: var(--dropdown-bg-color);
	color: var(--dropdown-text-color);

	border: 1px solid var(--loading-dark);
	border-radius: 0.3rem;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

	z-index: 1;

	visibility: hidden;
	opacity: 0;
	transform: translateY(-20%);

	transition: all 0.2s ease;
}

.dropdown-menu[aria-checked='true'] {
	visibility: visible;
	opacity: 1;
	transform: translateY(0%);
}

.dropdown-menu li {
	width: 100%;
	padding: 0.5rem 1.2rem;

	white-space: nowrap;

	font-size: var(--font-small);

	cursor: pointer;
}

.dropdown-menu li:first-child {
	border-bottom: 1px solid var(--loading-dark);
}

.dropdown-menu li:hover {
	color: var(--text-color);
}
</style>
