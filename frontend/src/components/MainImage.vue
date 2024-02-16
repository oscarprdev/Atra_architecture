<script setup lang="ts">
import type { File } from '../api';
import { defineProps, onMounted, ref } from 'vue';
import { IMAGE_URL } from '../constants';

const props = defineProps<{
    images: File[];
}>();

const fixedIndex = ref(0);
const animatedIndex = ref(1);

onMounted(() => {
    setInterval(() => {
        fixedIndex.value = (fixedIndex.value + 1) % props.images.length;
        animatedIndex.value = (animatedIndex.value + 1) % props.images.length;
    }, 3300);
});
</script>

<template>
    <section class="main-image-container">
        <div class="slider-container">
            <picture
                class="picture-container"
                v-if="props.images.length > 0"
            >
                <img
                    class="animated"
                    :key="animatedIndex"
                    :alt="images[animatedIndex].Key"
                    :src="`${IMAGE_URL}/${images[animatedIndex].Key}`"
                />
                <img
                    :alt="images[fixedIndex].Key"
                    :src="`${IMAGE_URL}/${images[fixedIndex].Key}`"
                />
            </picture>
        </div>
    </section>
</template>

<style>
.main-image-container {
    padding-top: 5rem;
    width: 100%;
    height: 100vh;
}

.slider-container {
    overflow: hidden;
    width: 80%;
    height: 70%;
}

.picture-container {
    position: relative;
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100%;
}

.animated {
    position: absolute;
    top: 0;
    left: -100%;
    animation: slide-right 2s ease-in-out forwards;
    animation-delay: 1s;
}

@media (width < 650px) {
    .main-image-container {
        height: 85vh;
        margin-top: -2rem;
    }
}
</style>
