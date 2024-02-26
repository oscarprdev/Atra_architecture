<script setup lang="ts">
import { IconDotsVertical, IconRotateClockwise } from '@tabler/icons-vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Project } from '../../../api';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { updateProject } from '../../../api/endpoints/update-project';
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';

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
	emitter.emit(EMITTER_NAMES.modal, {
		componentName: 'RemoveProjectModal',
		projects: props.checkedProjects,
		action: EMITT_ACTIONS.REMOVE,
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
				<ActionButton
					:text="isUpdatePending ? '' : 'Destacar'"
					:kind="BUTTON_KINDS.SECONDARY"
					:disabled="isUpdatePending"
					@on-action-click="onUpdateTopProjects">
					<template
						#icon
						v-if="isUpdatePending">
						<IconRotateClockwise
							width="20"
							class="spinner" />
					</template>
				</ActionButton>
				<ActionButton
					text="Eliminar"
					:kind="BUTTON_KINDS.SECONDARY"
					:disabled="isUpdatePending"
					@on-action-click="onRemoveProjects" />
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

.projects-actions-tooltip .actions button:not(:disabled):hover {
	background-color: var(--primary-hover);
}

.projects-actions-tooltip[aria-checked='true'] {
	visibility: visible;
	transform: translateX(0%);
	opacity: 1;
}
</style>
../../../api/endpoints/update-is-top-field
