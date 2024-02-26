<script setup lang="ts">
defineProps<{
	error: string;
}>();
</script>

<template>
	<div class="toast">
		<p>{{ error }}</p>
	</div>
</template>

<style scoped>
.toast {
	position: absolute;
	bottom: 2rem;
	right: 2rem;

	width: fit-content;
	padding: 1rem;
	background-color: red;
	color: white;

	opacity: 0;

	border-radius: var(--border-radius);
	animation: fadeup-down-toast 5s linear forwards;
}

@keyframes fadeup-down-toast {
	0% {
		opacity: 0;
		visibility: visible;
		transform: translateY(30%);
	}

	20% {
		opacity: 1;
		visibility: visible;
		transform: translateY(0%);
	}

	80% {
		opacity: 1;
		visibility: visible;
		transform: translateY(0%);
	}

	100% {
		opacity: 0;
		visibility: visible;
		transform: translateY(30%);
	}
}
</style>
