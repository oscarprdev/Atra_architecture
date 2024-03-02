<script setup lang="ts">
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import CreateProjectForm from './CreateProjectForm.vue';
import type { ProjectFormState } from './CreateProjectForm.types';
import { reactive } from 'vue';
import { IconRotateClockwise, IconCircleCheck, IconInfoTriangle } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { createProjectUsecase } from '../../../features/projects/create/create-project.usecase';
import type { CreateProjectBody } from '../../../pages/api/generated';

const emits = defineEmits<{
	(e: 'close-modal'): void;
}>();

interface State {
	isSuccess: boolean;
	isLoading: boolean;
	error: string | null;
	requiredMessage: string | null;
}

const modalState = reactive<State>({
	isSuccess: false,
	isLoading: false,
	error: null,
	requiredMessage: null,
});

const displayRequiredMessage = () => {
	modalState.requiredMessage = 'El projecte deu tindre 2 imatges mínim';

	setTimeout(() => {
		modalState.requiredMessage = null;
	}, 3000);
};

const handleCreateProject = async (payload: CreateProjectBody) => {
	try {
		modalState.isLoading = true;
		await createProjectUsecase(payload);

		emitter.emit(EMITTER_NAMES.success, { action: EMITT_ACTIONS.SUCCESS });
	} catch (error) {
		modalState.isLoading = false;
		modalState.error = error as string;
	}
};

const onSubmit = async (values: ProjectFormState) => {
	if (!values.mainImage.value || values.images.value.length < 0) {
		return displayRequiredMessage();
	}

	const payload = {
		title: values.title.value,
		description: values.description.value,
		year: values.year.value,
		mainImage: values.mainImage.value,
		images: values.images.value,
		isTop: false,
	} satisfies CreateProjectBody;

	return await handleCreateProject(payload);
};

emitter.on(EMITTER_NAMES.modal, payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.CLOSE) {
		modalState.isLoading = false;
		modalState.isSuccess = true;
	}
});
</script>

<template>
	<div
		class="create-project-modal"
		:class="{
			default: !modalState.isLoading,
			state: modalState.isLoading || modalState.isSuccess || modalState.error,
		}">
		<template v-if="!modalState.isLoading && !modalState.isSuccess && !modalState.error">
			<h2>Crear un nou projecte</h2>
			<CreateProjectForm
				:required-message="modalState.requiredMessage"
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
		<template v-if="modalState.isLoading">
			<IconRotateClockwise
				width="40"
				height="40"
				stroke-width="1"
				class="spinner" />
			<h2>Creant projecte...</h2>
		</template>
		<template v-if="modalState.isSuccess">
			<IconCircleCheck
				width="40"
				height="40"
				stroke-width="1" />
			<h2>Projecte creat correctament</h2>
		</template>

		<template v-if="modalState.error">
			<IconInfoTriangle
				width="40"
				height="40"
				stroke-width="1" />
			<h2>{{ modalState.error }}</h2>
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

.state {
	width: 70vw;
	max-width: 250px;
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
</style>
