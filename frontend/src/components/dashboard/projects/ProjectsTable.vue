<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Project } from '../../../api';
import InputCheckbox from './InputCheckbox.vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';
import { getProjectList } from '../../../api/projects/get-projects-list';
import ProjectRow from './ProjectRow.vue';
import ProjectsSkeleton from './ProjectsSkeleton.vue';

import { IconDotsVertical, IconTrashX, IconCrown } from '@tabler/icons-vue';

const isLoading = ref(false);
const projects = ref<Project[]>([]);
const isAllChecked = ref(false);
const checkedProjects = ref<{ [key: string]: boolean }>({});

const isProjectsActionsDotsVisible = ref(false);
const isProjectsActionsTooltipVisible = ref(false);

watch(checkedProjects.value, projects => {
	if (Object.values(projects).some(project => project)) {
		isProjectsActionsDotsVisible.value = true;
	} else {
		isProjectsActionsDotsVisible.value = false;
	}
});

const onProjectsActionsDotsClick = () => {
	isProjectsActionsTooltipVisible.value = !isProjectsActionsTooltipVisible.value;
};

const onToggleAllCheckboxes = () => {
	isAllChecked.value = !isAllChecked.value;
	projects.value.forEach(project => {
		checkedProjects.value[project.id] = isAllChecked.value;
	});

	emitter.emit(EMITTER_NAMES.showHeaderActionButtons, isAllChecked.value);
};

const onToggleCheckedProject = (id: string) => {
	checkedProjects.value[id] = !checkedProjects.value[id];

	emitter.emit(EMITTER_NAMES.showHeaderActionButtons, checkedProjects.value[id]);
};

const filterProjectsBySearchValue = async (searchValue: string) => {
	if (searchValue.length > 0) {
		projects.value = projects.value.filter(project =>
			project.title.toLowerCase().includes(searchValue.toLowerCase())
		);
	} else {
		mountProjectList();
	}
};

emitter.on(EMITTER_NAMES.searchProject, async searchValue =>
	typeof searchValue === 'string'
		? await filterProjectsBySearchValue(searchValue)
		: emitter.off(EMITTER_NAMES.searchProject)
);

const mountProjectList = async () => {
	isLoading.value = true;
	const response = (await getProjectList()) || [];
	isLoading.value = false;
	projects.value = response;
};

onMounted(async () => mountProjectList());
</script>

<template>
	<table>
		<thead>
			<tr>
				<div
					v-if="isProjectsActionsDotsVisible"
					class="projects-actions">
					<span
						class="projects-actions-tooltip"
						:aria-checked="isProjectsActionsTooltipVisible">
						<p>
							Projectes seleccionats:
							{{ Object.values(checkedProjects).filter(project => project).length }}
						</p>
						<div class="actions">
							<button class="icon-btn"><IconCrown width="16" />Destacar</button>
							<button class="icon-btn"><IconTrashX width="16" /> Eliminar</button>
						</div>
					</span>
					<IconDotsVertical
						class="icon"
						@click="onProjectsActionsDotsClick" />
				</div>
				<InputCheckbox
					:id="'checkbox-head'"
					:checked="isAllChecked"
					@on-click="onToggleAllCheckboxes" />
				<th class="table-main-image">Image</th>
				<th class="table-name">Nom</th>
				<th class="table-description">Descripcio</th>
				<th class="table-year">Any</th>
				<th class="table-date">Actualitzat</th>
				<th class="table-dropdown">Accions</th>
			</tr>
		</thead>
		<tbody>
			<ProjectRow
				v-for="project in projects"
				:is-project-checked="!!checkedProjects[project.id]"
				:project="project"
				@toggle-checked-project="onToggleCheckedProject" />
			<ProjectsSkeleton
				v-if="isLoading"
				v-for="i in new Array(6).fill('')" />
		</tbody>
	</table>
</template>

<style>
table,
tbody {
	border-collapse: collapse;
	text-align: left;
	box-sizing: border-box;
	width: 100%;
	color: var(--text-light);
}

tbody {
	padding: 2rem;
}

tbody,
tr {
	transition: all 0.3s ease;
}

th,
td {
	text-align: left;
	padding: 1rem;

	width: 130px;
}

td {
	font-size: var(--font-small);
}

th {
	font-size: var(--font-medium);
}

tr {
	position: relative;
	display: flex;
	align-items: center;
	margin: 0 2rem;
	gap: 1rem;
	border-bottom: 1px solid var(--card-hover-color);
}

tbody > tr:hover {
	background-color: var(--card-hover-color);
}

.projects-actions {
	position: absolute;
	left: -2rem;
	padding: 1rem;
}

.projects-actions .icon {
	cursor: pointer;
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

.table-main-image {
	width: fit-content;
	min-width: 40px;
	margin-left: 0.5rem;
}

.table-name {
	margin-left: -0.5rem;
	width: 160px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.table-description {
	width: 370px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-left: -1.8rem;
}

.table-year {
	width: fit-content;
}

.table-date {
	width: fit-content;
}

.table-dropdown {
	margin-left: 3.2rem;
}
</style>
