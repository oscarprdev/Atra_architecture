<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { Project } from '../../../api';
import InputCheckbox from './InputCheckbox.vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import { getProjectList, type GetProjectListInput } from '../../../api/endpoints/get-projects-list';
import ProjectRow from './ProjectRow.vue';
import ProjectsSkeleton from './ProjectsSkeleton.vue';
import CommonActionsTooltip from './CommonActionsTooltip.vue';
import Pagination from './Pagination.vue';

const currentPage = ref(1);
const isLoading = ref(false);

const projects = ref<Project[]>([]);
const checkedProjects = ref<Project[]>([]);
const areAllProjectsChecked = ref(false);

const sortedValues = reactive<{ top?: boolean; year?: boolean; date?: boolean }>({
	top: undefined,
	year: undefined,
	date: undefined,
});

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

emitter.on(EMITTER_NAMES.searchProject, async searchValue => {
	if (typeof searchValue === 'string') {
		await mountProjectList({ page: currentPage.value, search: searchValue });
	} else {
		await mountProjectList({ page: currentPage.value });
	}
});

emitter.on(EMITTER_NAMES.sort, async payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.SORT) {
		switch (payload.kind) {
			case 'year':
				sortedValues.year = true;
				sortedValues.date = undefined;
				sortedValues.top = undefined;
				await mountProjectList({ page: currentPage.value, year: sortedValues.year });
				break;
			case 'top':
				sortedValues.top = true;
				sortedValues.date = undefined;
				sortedValues.year = undefined;
				await mountProjectList({ page: currentPage.value, isTop: sortedValues.top });
				break;
			case 'date':
				sortedValues.date = true;
				sortedValues.top = undefined;
				sortedValues.year = undefined;
				await mountProjectList({ page: currentPage.value, date: sortedValues.date });
				break;
			default:
				sortedValues.date = undefined;
				sortedValues.top = undefined;
				sortedValues.year = undefined;
				await mountProjectList({ page: currentPage.value });
				break;
		}
	}
});

emitter.on(EMITTER_NAMES.success, async payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.SUCCESS) {
		await mountProjectList({
			page: currentPage.value,
			year: sortedValues.year,
			date: sortedValues.date,
			isTop: sortedValues.top,
		});
	}

	emitter.emit(EMITTER_NAMES.modal, { action: EMITT_ACTIONS.CLOSE });
});

emitter.on(EMITTER_NAMES.pagination, async payload => {
	if (typeof payload === 'object' && payload.action === EMITT_ACTIONS.PAGINATION) {
		currentPage.value = payload.currentPage;

		await mountProjectList({
			page: currentPage.value,
			date: sortedValues.date,
			year: sortedValues.year,
			isTop: sortedValues.top,
		});
	}
});

const mountProjectList = async ({ page, search, date, year, isTop }: GetProjectListInput) => {
	isLoading.value = true;
	const response = (await getProjectList({ page, search, year, date, isTop })) || [];
	isLoading.value = false;
	projects.value = response;

	emitter.emit(EMITTER_NAMES.pagination, {
		currentPage: page,
		totalProject: projects.value.length,
		action: EMITT_ACTIONS.NUM_PROJECTS,
	});
};

onMounted(async () => mountProjectList({ page: currentPage.value }));
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
				v-if="!isLoading"
				v-for="project in projects"
				:key="project.id"
				:is-project-checked="checkedProjects.some(pr => pr.id === project.id)"
				:project="project"
				@toggle-checked-project="onToggleCheckedProject" />
			<ProjectsSkeleton
				v-else-if="isLoading"
				v-for="i in new Array(6).fill('')" />
			<tr
				v-else-if="!isLoading && projects.length === 0"
				class="empty">
				<p>Cap resultat</p>
			</tr>
			<tr class="pagination">
				<Pagination />
			</tr>
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
	font-size: var(--font-small);
}

tr {
	position: relative;
	display: flex;
	align-items: center;
	margin: 0 2rem;
	gap: 1rem;
	height: 82px;
	border-bottom: 1px solid var(--primary-light);
}

thead tr {
	height: 60px;
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

.pagination {
	display: flex;
	justify-content: end;
	padding-top: -5rem;
	margin-right: 1.2rem;
}

.pagination:hover {
	background-color: transparent;
}

.empty {
	display: flex;
	justify-content: center;
	text-align: center;
}
</style>
