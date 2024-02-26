<script setup lang="ts">
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import CreateProjectForm from './CreateProjectForm.vue';
import type { ProjectFormState } from './CreateProjectForm.types';
import { onUnmounted, ref } from 'vue';
import { createProject } from '../../../api/endpoints/create-project';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { IconRotateClockwise } from '@tabler/icons-vue';
import type { CreateProjectBody } from '../../../api/endpoints/create-project';

const emits = defineEmits<{
	(e: 'close-modal'): void;
}>();

const modalLoading = ref(false);
const formRequiredMessage = ref<string>();

const onSubmit = async (values: ProjectFormState) => {
	if (values.mainImage.value && values.images.value.length > 0) {
		const payload = {
			title: values.title.value,
			description: values.description.value,
			year: values.year.value,
			mainImage: values.mainImage.value,
			images: values.images.value,
			isTop: false,
		} satisfies CreateProjectBody;

		modalLoading.value = true;
		await createProject(payload);

		emits('close-modal');
		emitter.emit(EMITTER_NAMES.modal, { action: EMITT_ACTIONS.CLOSE });
	} else {
		formRequiredMessage.value = 'El projecte deu tindre 2 imatges mínim';

		setTimeout(() => {
			formRequiredMessage.value = undefined;
		}, 3000);
	}
};

onUnmounted(() => {
	modalLoading.value = false;
});
</script>

<template>
	<div
		class="create-project-modal"
		:class="{ default: !modalLoading, loading: modalLoading }">
		<template v-if="!modalLoading">
			<h2>Crear un nou projecte</h2>
			<CreateProjectForm
				:required-message="formRequiredMessage"
				@submit="onSubmit">
				<template #actions>
					<div class="action-buttons">
						<ActionButton
							text="Cancelar"
							:kind="BUTTON_KINDS.SECONDARY"
							@on-action-click="emits('close-modal')" />
						<ActionButton
							text="Crear projecte"
							:type="'submit'"
							:kind="BUTTON_KINDS.PRIMARY" />
					</div>
				</template>
			</CreateProjectForm>
		</template>
		<template v-if="modalLoading">
			<h2>Creant projecte...</h2>
			<IconRotateClockwise
				width="40"
				height="40"
				stroke-width="1"
				class="spinner" />
		</template>
	</div>
</template>

<style scoped>
.create-project-modal {
	height: fit-content;

	display: grid;
	place-items: center;
	gap: 0;
	color: var(--text-color);
	border-radius: var(--border-radius);

	text-align: center;
}

.default {
	width: 90vw;
	max-width: 500px;
}

.loading {
	width: 70vw;
	max-width: 250px;
}

h2 {
	font-size: var(--font-medium);
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	gap: 1rem;
	margin-top: 1rem;
}
</style>
