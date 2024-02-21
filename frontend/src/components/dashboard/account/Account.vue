<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { API_URL } from '../../../constants';
import type { User } from '../../../api';

const user = ref<User | null>(null);

onMounted(async () => {
    const response = await fetch(`${API_URL}/user/describe`);
    const jsonResponse = await response.json();

    user.value = jsonResponse.data;
});
</script>

<template>
    <section>
        <h1>Account</h1>
    </section>
</template>

<style>
section {
    box-sizing: border-box;
    height: 100vh;
}
</style>
