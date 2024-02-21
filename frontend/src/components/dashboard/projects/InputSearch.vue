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
            placeholder="Busca un projecte..."
            @input="onInputChange"
            :value="inputValue"
        />
    </label>
</template>

<style scoped>
.search-container {
    position: relative;
    padding: 0.2rem;
    padding-right: 1rem;
    border-radius: 0.5rem;
    background-color: var(--card-hover-color);
    display: flex;
    align-items: center;
}

.icon-search {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: var(--text-light);
    z-index: 10;
}

.input-search {
    padding: 0.5rem;
    padding-left: 2.5rem;
    width: 100%;
    border: none;
    outline: none;
    color: var(--text-light);
    background-color: transparent;
    font-size: 1rem;
    caret-color: var(--contrast);
    text-transform: capitalize;
    font-weight: 100;
}

.input-search::placeholder {
    color: var(--text-light);
    font-weight: 100;
}

.icon-search {
    width: 1rem;
    height: auto;
}
</style>
