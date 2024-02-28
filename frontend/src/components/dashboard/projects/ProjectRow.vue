<script setup lang="ts">
import type { Project } from '../../../api';
import { strCapitalized } from '../../../utils/strCapitalized';
import { strDate } from '../../../utils/strDate';
import { IMAGE_URL } from '../../../constants';
import InputCheckbox from './InputCheckbox.vue';
import Dropdown from '../Dropdown.vue';
import type { Option } from '../Dropdown.types';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';

const props = defineProps<{
	project: Project;
	isProjectChecked: boolean;
}>();

const emits = defineEmits<{
	(e: 'toggleCheckedProject', id: string): void;
}>();

const actionDropdownOptions: Option[] = [
	{
		label: 'Editar',
		cb: () =>
			emitter.emit(EMITTER_NAMES.modal, {
				componentName: 'EditProjectModal',
				project: props.project,
				action: EMITT_ACTIONS.EDIT,
			}),
	},
	{
		label: 'Eliminar',
		cb: () =>
			emitter.emit(EMITTER_NAMES.modal, {
				componentName: 'RemoveProjectModal',
				projects: [props.project],
				action: EMITT_ACTIONS.REMOVE,
			}),
	},
];
</script>
<template>
	<tr
		:class="{ isTop: project.isTop }"
		:key="project.id">
		<InputCheckbox
			:id="'checkbox-' + project.id"
			:checked="isProjectChecked"
			@on-click="emits('toggleCheckedProject', project.id)" />
		<td class="table-main-image">
			<img
				:src="`${IMAGE_URL}/${project.mainImage}`"
				:alt="`Main image of ${project.title}`" />
		</td>
		<td class="table-name">{{ strCapitalized(project.title) }}</td>
		<td class="table-description">
			{{ strCapitalized(project.description) }}
		</td>
		<td class="table-year">{{ project.year }}</td>
		<td class="table-date">
			{{ strDate(project.updatedAt) }}
		</td>
		<td class="table-dropdown">
			<Dropdown
				:options="actionDropdownOptions"
				default-text="Accions" />
		</td>
	</tr>
</template>

<style scoped>
img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.isTop {
	border-left: 2px solid var(--contrast);
}

.table-main-image {
	position: relative;
}

.table-date {
	width: fit-content;
}
</style>
