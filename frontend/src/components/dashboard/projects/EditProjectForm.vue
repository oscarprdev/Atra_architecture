<script setup lang="ts">
import { computed, onUnmounted, reactive, watch } from 'vue';
import type { Project } from '../../../api';
import type { ProjectFormState } from './CreateProjectForm.types';
import { strCapitalized } from '../../../utils/strCapitalized';
import { IMAGE_URL } from '../../../constants';
import ProjectForm from './ProjectForm.vue';

const props = defineProps<{
	requiredMessage?: string | null;
	project: Project;
}>();

const emits = defineEmits<{
	(e: 'submit', values: ProjectFormState): void;
}>();

const formState = reactive<ProjectFormState>({
	title: {
		value: props.project.title,
		error: null,
	},
	description: {
		value: props.project.description,
		error: null,
	},
	year: {
		value: props.project.year,
		error: null,
	},
	mainImage: {
		value: props.project.mainImage as unknown as File,
		error: null,
	},
	images: {
		value: props.project.images as unknown as File[],
		error: null,
	},
});

const imagePreviews = reactive({
	mainImagePreview: `${IMAGE_URL}/${props.project.mainImage}`,
	imagesPreviews: props.project.images.map(img => `${IMAGE_URL}/${img}`),
});

const onSubmit = (formState: ProjectFormState) => {
	emits('submit', formState);
};
</script>

<template>
	<ProjectForm
		:required-message="requiredMessage"
		:form-state="formState"
		:image-previews="imagePreviews"
		@submit="onSubmit">
		<template #actions>
			<slot name="actions" />
		</template>
	</ProjectForm>
</template>
