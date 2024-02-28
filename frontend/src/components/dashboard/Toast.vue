<script setup lang="ts">
import { ref } from 'vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../utils/emitter';

const kind = ref<'error' | 'success' | null>(null);
const message = ref<string>();

emitter.on(EMITTER_NAMES.error, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.ERROR) {
		message.value = payload.message;
		kind.value = 'error';

		setTimeout(() => {
			message.value = undefined;
		}, 5000);
	}
});

emitter.on(EMITTER_NAMES.successToast, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.SUCCESSTOAST) {
		message.value = payload.message;
		kind.value = 'success';

		setTimeout(() => {
			message.value = undefined;
		}, 5000);
	}
});
</script>

<template>
	<div
		v-if="message"
		:class="{ error: kind === 'error', success: kind === 'success' }"
		class="toast">
		<p>{{ message }}</p>
	</div>
</template>

<style scoped>
.toast {
	position: absolute;
	bottom: 2rem;
	right: 2rem;

	width: fit-content;
	padding: 1rem;
	opacity: 0;
	border-radius: 0.3rem;
	animation: fadeup-down-toast 5s linear forwards;
}
.error {
	background-color: red;
	color: white;
	border: 1px solid rgb(185, 0, 0);
}

.success {
	background-color: white;
	color: rgb(49, 49, 49);
	border: 1px solid rgb(49, 49, 49);
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
