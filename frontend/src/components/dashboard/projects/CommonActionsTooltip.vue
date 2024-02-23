<script setup lang="ts">
import { IconDotsVertical, IconTrashX, IconCrown, IconRotateClockwise } from '@tabler/icons-vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Project } from '../../../api';
import { MODAL_EMITTER_NAMES, modalEmitter } from '../../../utils/emitter';
import { updateProject } from '../../../api/projects/update-project';

const props = defineProps<{
	checkedProjects: Project[];
}>();

const emits = defineEmits<{
	(e: 'onProjectsUpdated', projects: Project[]): void;
}>();

const isUpdatePending = ref(false);
const tooltipContainer = ref<HTMLElement>();
const isProjectsActionsTooltipVisible = ref(false);

const numOfProjectsChecked = computed(() => Object.values(props.checkedProjects).filter(project => project).length);

const onProjectsActionsDotsClick = () => {
	if (numOfProjectsChecked.value > 0) {
		isProjectsActionsTooltipVisible.value = !isProjectsActionsTooltipVisible.value;
	}
};

const onUpdateTopProjects = async () => {
	const updatedProjects = props.checkedProjects.map(pr => ({ ...pr, isTop: !pr.isTop }));

	isUpdatePending.value = true;
	await Promise.all(updatedProjects.map(pr => updateProject(pr)));
	isUpdatePending.value = false;

	emits('onProjectsUpdated', updatedProjects);
	closeTooltip();
};

const onRemoveProjects = () => {
	modalEmitter.emit(MODAL_EMITTER_NAMES.showRemoveProjectModal, {
		componentName: 'RemoveProjectModal',
		projects: props.checkedProjects,
		kind: 'remove',
	});
	closeTooltip();
};

const closeTooltip = () => (isProjectsActionsTooltipVisible.value = false);

const onClickOutside = (event: MouseEvent) => {
	if (tooltipContainer.value && !tooltipContainer.value.contains(event.target as Node)) {
		closeTooltip();
	}
};

onMounted(() => {
	window.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
	window.removeEventListener('click', onClickOutside);
});
</script>

<template>
	<div
		ref="tooltipContainer"
		class="projects-actions"
		:class="{ tooltipAvailable: numOfProjectsChecked > 0 }">
		<span
			class="projects-actions-tooltip"
			:aria-checked="isProjectsActionsTooltipVisible">
			<p>
				Projectes seleccionats:
				{{ numOfProjectsChecked }}
			</p>
			<div class="actions">
				<button
					class="icon-btn"
					:disabled="isUpdatePending"
					@click="onUpdateTopProjects">
					<template v-if="!isUpdatePending"> <IconCrown width="16" />Destacar</template>
					<template v-else><IconRotateClockwise class="spinner" /></template>
				</button>
				<button
					class="icon-btn"
					:disabled="isUpdatePending"
					@click="onRemoveProjects">
					<IconTrashX width="16" />Eliminar
				</button>
			</div>
		</span>
		<IconDotsVertical
			class="icon"
			@click="onProjectsActionsDotsClick" />
	</div>
</template>

<style scoped>
.projects-actions {
	position: absolute;
	left: -2rem;
	padding: 1rem;
}

.projects-actions .icon {
	cursor: not-allowed;
	color: var(--dropdown-bg-color);
}

.tooltipAvailable .icon {
	cursor: pointer;
	color: var(--text-light);
}

.projects-actions-tooltip {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 0.5rem;
	position: absolute;
	top: 0.5rem;
	left: 3rem;
	z-index: 99999;
	padding: 1rem;

	transform: translateX(-10%);
	visibility: hidden;
	opacity: 0;
	transition: all 0.2s ease;

	border-radius: var(--border-radius);
	background-color: var(--dropdown-bg-color);
	box-shadow: var(--box-shadow);
}

.projects-actions-tooltip p {
	font-size: var(--font-small);
	color: var(--dropdown-text-color);
}

.projects-actions-tooltip .actions {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.projects-actions-tooltip .actions button {
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

.projects-actions-tooltip .actions button:not(:disabled):hover {
	color: var(--text-color);
}

.projects-actions-tooltip[aria-checked='true'] {
	visibility: visible;
	transform: translateX(0%);
	opacity: 1;
}
</style>
