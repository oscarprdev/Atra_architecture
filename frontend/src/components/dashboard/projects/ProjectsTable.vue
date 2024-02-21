<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Project } from '../../../api';
import InputCheckbox from './InputCheckbox.vue';
import { EMITTER_NAMES, emitter } from '../../../utils/emitter';
import { getProjectList } from '../../../api/projects/get-projects-list';
import ProjectRow from './ProjectRow.vue';
import ProjectsSkeleton from './ProjectsSkeleton.vue';

const isLoading = ref(false);
const projects = ref<Project[]>([]);
const isAllChecked = ref(false);
const checkedProjects = ref<{ [key: string]: boolean }>({});

const onToggleAllCheckboxes = () => {
	isAllChecked.value = !isAllChecked.value;
	projects.value.forEach(project => {
		checkedProjects.value[project.id] = isAllChecked.value;
	});
};

const onToggleCheckedProject = (id: string) => {
	checkedProjects.value[id] = !checkedProjects.value[id];
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
				<InputCheckbox
					:id="'checkbox-head'"
					:checked="isAllChecked"
					@on-click="onToggleAllCheckboxes" />
				<th class="table-main-image">Image</th>
				<th>Nom</th>
				<th class="table-description">Descripcio</th>
				<th>Any</th>
				<th>Actualitzacio</th>
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
	padding: 1rem 1.5rem;

	width: 130px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

tr {
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
}

.table-description {
	width: 300px;
}
</style>
