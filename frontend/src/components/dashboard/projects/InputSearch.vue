<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';
import { ref } from 'vue';

const inputValue = ref();

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement) {
		inputValue.value = target.value;
		emitter.emit(EMITTER_NAMES.searchProject, target.value);
	}
};
</script>

<template>
	<label class="search-container">
		<IconSearch class="icon-search" />
		<input
			class="input-search"
			type="search"
			@input="onInputChange"
			placeholder="Busca un projecte..."
			:value="inputValue" />
	</label>
</template>

<style scoped>
.search-container {
	position: relative;
	padding: 0.2rem;
	padding-right: 1rem;
	border-radius: var(--border-radius);
	background-color: var(--primary);
	display: flex;
	align-items: center;
	border: 1px solid var(--primary-light);
}

.search-container:focus-within {
	border: 1px solid var(--contrast);
	background-color: var(--primary-hover);
}
.search-container:hover {
	background-color: var(--primary-hover);
}

.icon-search {
	position: absolute;
	top: 50%;
	left: 1rem;
	transform: translateY(-50%);
	color: var(--text-color);
	z-index: 10;
}

.input-search {
	padding: 0.5rem;
	padding-left: 2.5rem;
	width: 100%;
	border: none;
	outline: none;
	color: var(--text-color);
	background-color: transparent;
	font-size: 1rem;
	caret-color: var(--contrast);
	font-weight: 100;

	font-size: var(--font-small);
}

.input-search::placeholder {
	color: var(--text-color);
	font-weight: 100;
}

.icon-search {
	width: 1rem;
	height: auto;
}
</style>
