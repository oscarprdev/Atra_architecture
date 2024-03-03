<script setup lang="ts">
import { IconExclamationMark } from '@tabler/icons-vue';

defineProps<{
	requiredMessage: string;
}>();
</script>

<template>
	<div class="required-container">
		<span class="required-icon">
			<IconExclamationMark
				stroke-width="3"
				height="20"
			/>
		</span>
		<p>{{ requiredMessage }}</p>
		<span class="triangle-up"></span>
	</div>
</template>

<style scoped>
.required-container {
	position: relative;
	width: 100%;
	height: 100%;

	display: flex;
	align-items: center;
	gap: 1rem;
}

.required-container p {
	font-weight: 500;
	color: black;
}

.required-icon {
	padding: 1;
	display: grid;
	place-items: center;
	background-color: #ff8c00;
	color: white;
}

.triangle-up {
	position: absolute;
	top: -1rem;

	width: 0;
	height: 0;
	border-left: 10px solid transparent; /* Left side of the triangle */
	border-right: 10px solid transparent; /* Right side of the triangle */
	border-bottom: 10px solid rgb(255, 255, 255); /* Base of the triangle (and the color) */
}
</style>
