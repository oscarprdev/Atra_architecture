<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from '../../../api';
import { BUTTON_KINDS } from '../ActionButton.types';
import ActionButton from '../ActionButton.vue';
import { removeProject } from '../../../api/endpoints/remove-project';
import { IconRotateClockwise, IconCircleCheck } from '@tabler/icons-vue';
import { emitter, EMITTER_NAMES, EMITT_ACTIONS } from '../../../utils/emitter';
import { strCapitalized } from '../../../utils/strCapitalized';

const props = defineProps<{
	projects: Project[];
}>();

const isSuccess = ref(false);
const isRemoving = ref(false);

const emits = defineEmits<{
	(e: 'close-modal'): void;
}>();

const onRemoveProjectClick = async () => {
	isRemoving.value = true;
	await Promise.all(props.projects.map(pr => removeProject(pr.id)));
	isRemoving.value = false;

	emitter.emit(EMITTER_NAMES.success, { action: EMITT_ACTIONS.SUCCESS });

	isSuccess.value = true;
	isRemoving.value = false;
};
</script>

<template>
	<div class="remove-project-modal">
		<template v-if="!isRemoving && !isSuccess">
			<h2 v-if="projects.length > 1">Estas segur que vols eliminar els projectes seleccionats?</h2>
			<h2 v-else="projects.length === 1">
				Estas segur que vols eliminar el projecte de
				<span class="project-title">{{ strCapitalized(projects[0].title) }}</span
				>?
			</h2>
			<div class="modal-actions">
				<ActionButton
					:kind="BUTTON_KINDS.SECONDARY"
					:disabled="isRemoving"
					@on-action-click="emits('close-modal')"
					text="Cancelar" />
				<ActionButton
					:kind="BUTTON_KINDS.SECONDARY"
					:disabled="isRemoving"
					text="Eliminar"
					@on-action-click="onRemoveProjectClick">
				</ActionButton>
			</div>
		</template>

		<template v-if="isRemoving">
			<IconRotateClockwise
				width="40"
				height="40"
				class="spinner"
				stroke-width="1" />
			<h2 v-if="projects.length > 1">Eliminant projectes</h2>
			<h2 v-else="projects.length === 1">
				Eliminant projecte de
				<span class="project-title">{{ strCapitalized(projects[0].title) }}</span>
			</h2>
		</template>

		<template v-if="isSuccess">
			<IconCircleCheck
				width="40"
				height="40"
				stroke-width="1" />
			<h2 v-if="projects.length > 1">Projectes eliminats correctament</h2>
			<h2 v-else="projects.length === 1">
				Projecte de
				<span class="project-title">{{ strCapitalized(projects[0].title) }}</span>
				eliminat correctament
			</h2>
		</template>
	</div>
</template>

<style scoped>
.remove-project-modal {
	width: 90vw;
	max-width: 300px;

	height: fit-content;

	display: grid;
	place-items: center;
	gap: 0;
	color: var(--text-color);
	border-radius: var(--border-radius);

	text-align: center;
}

h2 {
	font-size: var(--font-small);
	width: 100%;
	font-weight: 200;
}

ul {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 0;

	width: 100%;
	height: 100%;
}

li {
	display: flex;
	align-items: center;
	gap: 1rem;

	width: 100%;
	height: 100%;
}

picture {
	display: grid;
	place-items: center;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	overflow: hidden;
}

img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.project-title {
	font-weight: bold;
}

.modal-actions {
	display: flex;
	align-items: center;
	gap: 2rem;
	margin-top: 1rem;
}

button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: var(--font-small);
	padding: 0.5rem 1.2rem;
	border-radius: 0.3rem;
	cursor: pointer;

	min-width: 80px;

	border: 1px solid var(--dropdown-text-color);
	background-color: var(--dropdown-bg-color);
	color: var(--dropdown-text-color);
}
</style>
