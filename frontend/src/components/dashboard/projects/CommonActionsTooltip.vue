<script setup lang="ts">
import { IconDotsVertical, IconRotateClockwise } from '@tabler/icons-vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Project } from '../../../api';
import { MODAL_EMITTER_NAMES, modalEmitter } from '../../../utils/emitter';
import { updateProject } from '../../../api/endpoints/update-project';

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
					:class="{ updating: isUpdatePending }"
					:disabled="isUpdatePending"
					@click="onUpdateTopProjects">
					<template v-if="!isUpdatePending">Destacar</template>
					<template v-else><IconRotateClockwise class="spinner" /></template>
				</button>
				<button
					:disabled="isUpdatePending"
					@click="onRemoveProjects">
					Eliminar
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
	color: var(--primary-light);
}

.tooltipAvailable .icon {
	cursor: pointer;
	color: var(--text-color);
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

	border: 1px solid var(--border-dropdown);
	border-radius: var(--border-radius);
	background-color: var(--bg-dropdown);
	box-shadow: var(--box-shadow);
}

.projects-actions-tooltip p {
	font-size: var(--font-small);
	color: var(--text-color);
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
	padding: auto 1.2rem;
	border-radius: 0.3rem;
	cursor: pointer;

	height: 40px;
	min-width: 100px;

	border: 1px solid var(--border-dropdown);
	background-color: var(--bg-dropdown);
	color: var(--text-color);

	transition: all 0.2s ease;
}

.projects-actions-tooltip .actions button:not(:disabled):hover {
	background-color: var(--primary-hover);
}

.projects-actions-tooltip[aria-checked='true'] {
	visibility: visible;
	transform: translateX(0%);
	opacity: 1;
}

.updating {
	padding: 0.25rem 1.2rem !important;
}
</style>
