<script setup lang="ts">
import { ref } from 'vue';
import type { Option } from './Dropdown.types';
import { IconChevronUp } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../utils/emitter';

const props = defineProps<{
	options: Option[];
	defaultText: string;
}>();

const isDropdownDisabled = ref(false);
const selectedOption = ref(props.defaultText);
const isOpen = ref(false);
const options = ref<Option[]>(props.options);

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
	isOpen.value = false;
	selectedOption.value = option.label;
	isDropdownDisabled.value = true;
	const optionToPerform = options.value.find(op => op.label === option.label);
	optionToPerform?.cb();
};

emitter.on(EMITTER_NAMES.dropdown, () => {
	selectedOption.value = props.defaultText;
});

emitter.on(EMITTER_NAMES.pagination, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.NUM_PROJECTS) {
		isDropdownDisabled.value = false;
	}
});
</script>

<template>
	<div class="dropdown">
		<button
			:class="{ opened: isOpen || selectedOption !== props.defaultText }"
			:disabled="isDropdownDisabled"
			@click="toggleDropdown">
			<p>{{ selectedOption }}</p>
			<IconChevronUp
				class="icon"
				:class="{ rotate: !isOpen }" />
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

	width: fit-content;
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
	cursor: pointer;

	gap: 0.5rem;
	padding: 0.5rem 1.2rem;
	border-radius: var(--border-radius);
	min-width: 120px;

	border: none;
	background-color: var(--primary-light);
	color: var(--text-color);
}

.opened:not(:disabled) {
	background-color: var(--contrast-light);
	border: 1px solid var(--contrast-dark);
}

.dropdown-menu {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0.5rem 0;

	margin-top: 0.75rem;
	min-width: 120px;

	background-color: var(--bg-dropdown);
	color: var(--text-color);

	border: 1px solid var(--border-dropdown);
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);

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
	transition: all 0.2s ease;
	cursor: pointer;
}

.dropdown-menu li:hover {
	background-color: var(--primary-hover);
}
</style>
