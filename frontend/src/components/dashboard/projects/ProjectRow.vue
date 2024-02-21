<script setup lang="ts">
import type { Project } from '../../../api';
import { strCapitalized } from '../../../utils/strCapitalized';
import { IMAGE_URL } from '../../../constants';
import InputCheckbox from './InputCheckbox.vue';

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
		</td>
		<td>{{ strCapitalized(project.title) }}</td>
		<td class="table-description">{{ strCapitalized(project.description) }}</td>
		<td>{{ project.year }}</td>
		<td>{{ project.updatedAt }}</td>
	</tr>
</template>

<style scoped>
img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
</style>
