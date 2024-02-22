<script setup lang="ts">
import { IconDotsVertical, IconTrashX, IconCrown } from '@tabler/icons-vue';
import { ref, computed } from 'vue';
import type { Project } from '../../../api';

const props = defineProps<{
	checkedProjects: Project[];
}>();

const emits = defineEmits<{
	(e: 'updateTopProjects', projects: Project[]): void;
}>();

const isProjectsActionsTooltipVisible = ref(false);

const numOfProjectsChecked = computed(() => Object.values(props.checkedProjects).filter(project => project).length);

const onProjectsActionsDotsClick = () => {
	if (numOfProjectsChecked.value > 0) {
		isProjectsActionsTooltipVisible.value = !isProjectsActionsTooltipVisible.value;
	}
};
</script>

<template>
	<div
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
				<button class="icon-btn"><IconCrown width="16" />Destacar</button>
				<button class="icon-btn"><IconTrashX width="16" />Eliminar</button>
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
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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
	gap: 0.5rem;
	font-size: var(--font-small);
	padding: 0.5rem 1.2rem;
	border-radius: 0.3rem;
	cursor: pointer;

	border: 1px solid var(--dropdown-text-color);
	background-color: var(--dropdown-bg-color);
	color: var(--dropdown-text-color);
}

.projects-actions-tooltip .actions button:hover {
	color: var(--text-color);
}

.projects-actions-tooltip[aria-checked='true'] {
	visibility: visible;
	transform: translateX(0%);
	opacity: 1;
}
</style>
