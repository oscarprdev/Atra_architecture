<script setup lang="ts">
import { currentYear } from '../../../utils/currentYear';
import InputForm from '../InputForm.vue';
import TextareaForm from '../TextareaForm.vue';
import MainImageForm from './MainImageForm.vue';
import ImagesListForm from './ImagesListForm.vue';
import type { ProjectFormState, ImagePreviews } from './CreateProjectForm.types';
import { IconExclamationMark } from '@tabler/icons-vue';
import { FORM_NAMES, VALID_IMAGE_TYPES, MAX_NUM_IMAGES } from './ProjectForm.constants';
import { IMAGE_URL } from '../../../constants';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps<{
	requiredMessage?: string | null;
	formState: ProjectFormState;
	imagePreviews: ImagePreviews;
}>();

const emits = defineEmits<{
	(e: 'submit', values: ProjectFormState): void;
}>();

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in props.formState) {
		switch (target.name) {
			case FORM_NAMES.TITLE:
				props.formState.title.value = target.value;
				break;
			case FORM_NAMES.YEAR:
				props.formState.year.value = Number(target.value);
				break;
			case FORM_NAMES.MAINIMAGE:
				const file = target.files && target.files[0];

				if (file && VALID_IMAGE_TYPES.includes(file.type)) {
					props.formState.mainImage.value = file;
					props.imagePreviews.mainImagePreview = URL.createObjectURL(file);
				}
				break;
			case FORM_NAMES.IMAGES:
				props.formState.images.error = null;
				const files = target.files;

				if (files) {
					if (Array.from(files).length + props.formState.images.value.length > MAX_NUM_IMAGES) {
						props.formState.images.error = `Màxim ${MAX_NUM_IMAGES} imatges per projecte`;
						return;
					}

					Array.from(files).forEach(file => {
						if (props.formState.images.value.some(img => img.name === file.name)) return;

						if (VALID_IMAGE_TYPES.includes(file.type)) {
							props.formState.images.value = props.formState.images.value.concat(file);
						}
					});

					props.imagePreviews.imagesPreviews =
						props.formState.images.value?.map(img => {
							if (img instanceof File) {
								return URL.createObjectURL(img);
							} else {
								return `${IMAGE_URL}/${img}`;
							}
						}) || null;
				}
				break;
			default:
				break;
		}
	}
};

const onTextareaChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLTextAreaElement) {
		props.formState.description.value = target.value;
	}
};

const onRemoveImageClick = (index: number) => {
	const currentImages = props.formState.images.value;

	props.formState.images.value = currentImages.filter((_, i) => i !== index);
	props.imagePreviews.imagesPreviews =
		props.formState.images.value?.map(img => {
			if (img instanceof File) {
				return URL.createObjectURL(img);
			} else {
				return `${IMAGE_URL}/${img}`;
			}
		}) || null;
};

const onSubmit = (e: Event) => {
	e.preventDefault();

	emits('submit', props.formState);
};
</script>

<template>
	<form
		data-testid="create-project-form"
		@submit="onSubmit"
	>
		<InputForm
			title="Nom"
			type="text"
			placeholder="Quin es el nom del projecte?"
			:name="FORM_NAMES.TITLE"
			:value="formState.title.value"
			@input="onInputChange"
		/>
		<InputForm
			title="Any"
			type="number"
			placeholder="Selecciona l'any"
			:options="{ max: currentYear(), step: 1, min: 2000 }"
			:name="FORM_NAMES.YEAR"
			:value="formState.year.value.toString()"
			@input="onInputChange"
		/>
		<TextareaForm
			title="Descripció"
			placeholder="Escriu una descripció"
			:maxLength="150"
			:name="FORM_NAMES.DESCRIPTION"
			:value="formState.description.value"
			@change="onTextareaChange"
		/>
		<div class="images">
			<MainImageForm
				title="Imatge principal"
				text="Selecciona una imatge"
				:name="FORM_NAMES.MAINIMAGE"
				:main-image-preview="imagePreviews.mainImagePreview"
				@change="onInputChange"
			/>
			<ImagesListForm
				title="Resta d'imatges"
				:images-previews="imagePreviews.imagesPreviews"
				:name="FORM_NAMES.IMAGES"
				:error="formState.images.error"
				:max-num-images="MAX_NUM_IMAGES"
				@change="onInputChange"
				@remove="onRemoveImageClick"
			/>
		</div>
		<slot name="actions" />
		<div
			v-if="requiredMessage"
			class="required-message-container"
		>
			<ErrorMessage :required-message="requiredMessage" />
		</div>
	</form>
</template>

<style scoped>
form {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	width: 95%;
}

.images {
	display: flex;
	align-items: start;
	gap: 0.5rem;
	width: 100%;
}

.required-message-container {
	position: absolute;
	bottom: 8rem;
	left: 2rem;
	width: fit-content;
	padding: 0.5rem;
	background-color: white;
	border-radius: 0.2rem;
	opacity: 0;
	visibility: hidden;

	animation: fadeup-down 3s linear forwards;
}
</style>
