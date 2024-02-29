<script setup lang="ts">
import { ref } from 'vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../utils/emitter';
import { IconCircleCheck, IconInfoTriangle } from '@tabler/icons-vue';

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
		<div class="toast-content">
			<IconCircleCheck
				v-if="kind === 'success'"
				stroke-width="1" />
			<IconInfoTriangle
				v-if="kind === 'error'"
				stroke-width="1" />
			<p>{{ message }}</p>
		</div>
	</div>
</template>

<style scoped>
.toast {
	position: absolute;
	bottom: 2rem;
	right: 2rem;

	display: grid;
	place-items: center;

	width: fit-content;
	padding: 0.2rem;

	border-radius: 0.5rem;
	background-color: var(--toast-bg);
	box-shadow:
		rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
		rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

	visibility: hidden;
	opacity: 0;
	animation: fadeup-down-toast 5s linear forwards;
}

.toast-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	border-radius: 0.3rem;
}
.error {
	color: rgb(240, 0, 0);
}

.success {
	color: rgba(66, 66, 66, 0.885);
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
