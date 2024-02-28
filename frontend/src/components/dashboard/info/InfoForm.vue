<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { User } from '../../../api';
import { IMAGE_URL } from '../../../constants';
import TextareaForm from '../TextareaForm.vue';
import MainImageForm from '../projects/MainImageForm.vue';
import ErrorMessage from '../ErrorMessage.vue';
import type { InfoFormState } from './InfoForm.types';

const FORM_NAMES = {
	IMAGE: 'image',
	DESCRIPTION: 'description',
};

const VALID_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const props = defineProps<{
	user: User;
}>();

const emits = defineEmits<{
	(e: 'submit', values: InfoFormState): void;
}>();

const formState = reactive<InfoFormState>({
	description: {
		value: props.user.description,
		error: null,
	},

	image: {
		value: props.user.image as unknown as File,
		error: null,
	},
});

const imagePreview = ref(`${IMAGE_URL}/${props.user.image}`);

const onTextareaChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLTextAreaElement) {
		formState.description.value = target.value;
	}
};

const onImageChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in formState) {
		const file = target.files && target.files[0];

		if (file && VALID_IMAGE_TYPES.includes(file.type)) {
			formState.image.value = file;
			imagePreview.value = URL.createObjectURL(file);
		} else {
			formState.image.error = 'Imatge no vàlida, deu ser .jpeg, .jpg o .webp';
		}
	}
};

const onSubmit = (e: Event) => {
	e.preventDefault();

	emits('submit', formState);
};
</script>
<template>
	<form
		v-if="user"
		@submit="onSubmit">
		<MainImageForm
			title="Imatge principal"
			text="Selecciona una imatge"
			isBig
			:name="FORM_NAMES.IMAGE"
			:main-image-preview="imagePreview"
			@change="onImageChange" />
		<TextareaForm
			title="Descripció"
			placeholder="Escriu una descripció"
			isBig
			:maxLength="user.description.length + 200"
			:name="FORM_NAMES.IMAGE"
			:value="user.description"
			@change="onTextareaChange" />
		<div class="action">
			<slot name="action" />
		</div>
		<div
			v-if="formState.image.error"
			class="required-message-container">
			<ErrorMessage :required-message="formState.image.error" />
		</div>
	</form>
</template>

<style scoped>
form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 90%;
	position: relative;
}

.required-message-container {
	position: absolute;
	top: 2rem;
	left: 2rem;
	width: fit-content;
	padding: 0.5rem;
	background-color: white;
	border-radius: 0.2rem;
	opacity: 0;
	visibility: hidden;

	animation: fadeup-down 4s linear forwards;
}
</style>
