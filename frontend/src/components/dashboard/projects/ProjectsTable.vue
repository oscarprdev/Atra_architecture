<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Project } from '../../../api';
import InputCheckbox from './InputCheckbox.vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';
import { getProjectList } from '../../../api/endpoints/get-projects-list';
import ProjectRow from './ProjectRow.vue';
import ProjectsSkeleton from './ProjectsSkeleton.vue';
import CommonActionsTooltip from './CommonActionsTooltip.vue';

const isLoading = ref(false);
const projects = ref<Project[]>([]);
const checkedProjects = ref<Project[]>([]);
const areAllProjectsChecked = ref(false);

const onToggleAllCheckboxes = () => {
	areAllProjectsChecked.value = !areAllProjectsChecked.value;
	if (areAllProjectsChecked.value) {
		checkedProjects.value = [];
		projects.value.forEach(project => {
			checkedProjects.value.push(project);
		});
	} else {
		cleanCheckedProjects();
	}
};

const onToggleCheckedProject = (id: string) => {
	const indexOfProjectChecked = checkedProjects.value.findIndex(pr => pr.id === id);

	if (indexOfProjectChecked >= 0) {
		checkedProjects.value.splice(indexOfProjectChecked, 1);

		if (checkedProjects.value.length === 0) {
			areAllProjectsChecked.value = false;
		}
		return;
	}

	const project = projects.value.find(pr => pr.id === id);

	if (project) {
		checkedProjects.value.push(project);
	}
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

const onProjectsUpdated = async (updatedProjects: Project[]) => {
	cleanCheckedProjects();

	projects.value = projects.value.map(
		pr => updatedProjects.find(updatedProject => updatedProject.id === pr.id) || pr
	);
};

const cleanCheckedProjects = () => {
	checkedProjects.value = [];
	areAllProjectsChecked.value = false;
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
				<CommonActionsTooltip
					:checked-projects="checkedProjects"
					@on-projects-updated="onProjectsUpdated" />
				<InputCheckbox
					:id="'checkbox-head'"
					:checked="areAllProjectsChecked"
					@on-click="onToggleAllCheckboxes" />
				<th class="table-main-image">Image</th>
				<th class="table-name">Nom</th>
				<th class="table-description">Descripció</th>
				<th class="table-year table-year--title">Any</th>
				<th class="table-date">Actualitzat</th>
				<th class="table-dropdown">Accions</th>
			</tr>
		</thead>
		<tbody>
			<ProjectRow
				v-for="project in projects"
				:is-project-checked="checkedProjects.some(pr => pr.id === project.id)"
				:project="project"
				@toggle-checked-project="onToggleCheckedProject" />
			<ProjectsSkeleton
				v-if="projects.length < 1 && isLoading"
				v-for="i in new Array(5).fill('')" />
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
	color: var(--text-color);
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
	height: 95px;
	border-bottom: 1px solid var(--primary-light);
}

tbody > tr:hover {
	background-color: var(--primary-hover);
}

.table-main-image {
	width: fit-content;
	min-width: 40px;
	margin-left: 0.5rem;
}

.table-name {
	width: 160px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.table-description {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-right: auto;
	width: 100%;
	max-width: 300px;
}

.table-year {
	width: fit-content;
}

.table-year--title {
	margin-left: -3rem;
}

.table-date {
	width: fit-content;
}

.table-dropdown {
	margin-left: auto;
	margin-right: 1rem;
}
</style>
