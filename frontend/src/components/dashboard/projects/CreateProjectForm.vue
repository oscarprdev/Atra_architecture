<script setup lang="ts">
import { currentYear } from '../../../utils/currentYear';
import { reactive } from 'vue';
import type { ProjectFormState } from './CreateProjectForm.types';
import ProjectForm from './ProjectForm.vue';

defineProps<{
	requiredMessage?: string | null;
}>();

const emits = defineEmits<{
	(e: 'submit', values: ProjectFormState): void;
}>();

const formState = reactive<ProjectFormState>({
	title: {
		value: '',
		error: null,
	},
	description: {
		value: '',
		error: null,
	},
	year: {
		value: currentYear(),
		error: null,
	},
	mainImage: {
		value: null,
		error: null,
	},
	images: {
		value: [],
		error: null,
	},
});

const imagePreviews = reactive({
	mainImagePreview: '',
	imagesPreviews: [] as string[] | null,
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
		@submit="onSubmit"
	>
		<template #actions>
			<slot name="actions" />
		</template>
	</ProjectForm>
</template>
