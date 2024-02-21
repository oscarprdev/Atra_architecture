<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { API_URL } from '../../../constants';
import type { User } from '../../../api';
import ProjectsHeader from './ProjectsHeader.vue';

const user = ref<User | null>(null);

onMounted(async () => {
    const response = await fetch(`${API_URL}/user/describe`);
    const jsonResponse = await response.json();

    user.value = jsonResponse.data;
});
</script>

<template>
    <ProjectsHeader />
    <section>
        <h1>Projects</h1>
    </section>
</template>

<style>
section {
    border-radius: var(--border-radius);
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background-color: var(--card-color);
}
</style>
