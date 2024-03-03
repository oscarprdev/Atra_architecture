<script setup lang="ts">
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import type { ProjectFormState } from './CreateProjectForm.types';
import { ref } from 'vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { IconRotateClockwise, IconCircleCheck } from '@tabler/icons-vue';
import type { Project } from '../../../api';
import { strCapitalized } from '../../../utils/strCapitalized';
import EditProjectForm from './EditProjectForm.vue';
import {
	updateProjectUsecase,
	type UpdateProjectPayload,
} from '../../../features/projects/update/update-project.usecase';

const props = defineProps<{
	project: Project;
}>();

const emits = defineEmits<{
	(e: 'close-modal'): void;
}>();
const isSuccess = ref(false);
const modalLoading = ref(false);
const formRequiredMessage = ref<string>();

const onSubmit = async (values: ProjectFormState) => {
	if (values.mainImage.value && values.images.value.length > 0) {
		const payload = {
			id: props.project.id,
			title: values.title.value,
			description: values.description.value,
			year: values.year.value,
			mainImage: values.mainImage.value,
			images: values.images.value,
			isTop: props.project.isTop,
		} satisfies UpdateProjectPayload;

		modalLoading.value = true;
		await updateProjectUsecase(payload);

		emitter.emit(EMITTER_NAMES.success, { action: EMITT_ACTIONS.SUCCESS });
	} else {
		formRequiredMessage.value = 'El projecte deu tindre 2 imatges mínim';

		setTimeout(() => {
			formRequiredMessage.value = undefined;
		}, 3000);
	}
};

emitter.on(EMITTER_NAMES.modal, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.CLOSE) {
		modalLoading.value = false;
		isSuccess.value = true;
	}
});
</script>

<template>
	<div
		class="edit-project-modal"
		:class="{ default: !modalLoading, loading: modalLoading, success: isSuccess }">
		<template v-if="!modalLoading && !isSuccess">
			<h2>
				Editar projecte de <span class="project-title">{{ strCapitalized(project.title) }}</span>
			</h2>
			<EditProjectForm
				:project="project"
				:required-message="formRequiredMessage"
				@submit="onSubmit">
				<template #actions>
					<div class="action-buttons">
						<ActionButton
							text="Cancelar"
							:kind="BUTTON_KINDS.SECONDARY"
							@on-action-click="emits('close-modal')" />
						<ActionButton
							text="Editar projecte"
							:type="'submit'"
							:kind="BUTTON_KINDS.PRIMARY" />
					</div>
				</template>
			</EditProjectForm>
		</template>
		<template v-if="modalLoading">
			<IconRotateClockwise
				width="40"
				height="40"
				stroke-width="1"
				class="spinner" />
			<h2>
				Editant projecte de <span class="project-title">{{ strCapitalized(project.title) }}</span>
			</h2>
		</template>
		<template v-if="isSuccess">
			<IconCircleCheck
				width="40"
				height="40"
				stroke-width="1" />
			<h2>
				Projecte de <span class="project-title">{{ strCapitalized(project.title) }}</span> editat correctament
			</h2>
		</template>
	</div>
</template>

<style scoped>
.edit-project-modal {
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

.success {
	width: 70vw;
	max-width: 300px;
}

h2 {
	font-size: var(--font-small);
	width: 100%;
	font-weight: 200;
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	gap: 1rem;
	margin-top: 1rem;
}

.project-title {
	font-weight: bold;
}
</style>
