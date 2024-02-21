<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue';
import ActionButton from '../ActionButton.vue';
import InputSearch from './InputSearch.vue';
</script>

<template>
    <header>
        <InputSearch />
        <ActionButton text="Crear">
            <template #icon>
                <IconPlus />
            </template>
        </ActionButton>
    </header>
</template>

<style>
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: var(--card-color);
    width: 100%;
    border-radius: var(--border-radius);
}
</style>
