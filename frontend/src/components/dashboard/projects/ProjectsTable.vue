<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { Project } from '../../../api';
import InputCheckbox from './InputCheckbox.vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';
import { getProjectList } from '../../../api/projects/get-projects-list';
import ProjectRow from './ProjectRow.vue';
import ProjectsSkeleton from './ProjectsSkeleton.vue';
import type { CheckedProjects } from './ProjectsTable.types';
import CommonActionsTooltip from './CommonActionsTooltip.vue';

const isLoading = ref(false);
const projects = ref<Project[]>([]);
const isAllChecked = ref(false);
const checkedProjects = ref<CheckedProjects>({});

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
				<CommonActionsTooltip :checked-projects="checkedProjects" />
				<InputCheckbox
					:id="'checkbox-head'"
					:checked="isAllChecked"
					@on-click="onToggleAllCheckboxes" />
				<th class="table-main-image">Image</th>
				<th class="table-name">Nom</th>
				<th class="table-description">Descripció</th>
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
