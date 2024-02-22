<script setup lang="ts">
import type { Project } from '../../../api';
import { strCapitalized } from '../../../utils/strCapitalized';
import { strDate } from '../../../utils/strDate';
import { IMAGE_URL } from '../../../constants';
import InputCheckbox from './InputCheckbox.vue';
import 'cooltipz-css';

defineProps<{
	project: Project;
	isProjectChecked: boolean;
}>();

const emits = defineEmits<{
	(e: 'toggleCheckedProject', id: string): void;
}>();
</script>
<template>
	<tr :key="project.id">
		<InputCheckbox
			:id="'checkbox-' + project.id"
			:checked="isProjectChecked"
			@on-click="emits('toggleCheckedProject', project.id)" />
		<td class="table-main-image">
			<img
				:src="`${IMAGE_URL}/${project.mainImage.Key}`"
				:alt="`Main image of ${project.title}`" />
			<div
				v-if="project.isTop"
				aria-label="Projecte destacat"
				data-cooltipz-dir="top"
				class="is-top"></div>
		</td>
		<td class="table-name">{{ strCapitalized(project.title) }}</td>
		<td class="table-description">
			{{ strCapitalized(project.description) }}
		</td>
		<td class="table-year">{{ project.year }}</td>
		<td class="table-date">
			{{ strDate(project.updatedAt) }}
		</td>
	</tr>
</template>

<style scoped>
img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.table-main-image {
	position: relative;
}

.is-top {
	top: -3.2rem;
	left: 2.8rem;
	width: 0.6rem;
	height: 0.6rem;

	background-color: var(--is-top);
	border-radius: 50%;
}

.table-date {
	width: fit-content;
}
</style>
