<script setup lang="ts">
import { IconPhotoPlus, IconLibraryPlus } from '@tabler/icons-vue';
import { currentYear } from '../../../utils/currentYear';
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { reactive } from 'vue';

const FORM_NAMES = {
	NAME: 'name',
	DESCRIPTION: 'description',
	YEAR: 'year',
	MAINIMAGE: 'mainImage',
	IMAGES: 'images',
};

const VALID_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const MAX_NUM_IMAGES = 12;

type FormControlField<T> = {
	value: T;
	error: string | null;
};

interface CreateProjectForm {
	name: FormControlField<string>;
	description: FormControlField<string>;
	year: FormControlField<number>;
	mainImage: FormControlField<File | null>;
	images: FormControlField<File[]>;
}

const formValues = reactive<CreateProjectForm>({
	name: {
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

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in formValues) {
		switch (target.name) {
			case FORM_NAMES.NAME:
				formValues.name.value = target.value;
				break;
			case FORM_NAMES.DESCRIPTION:
				formValues.description.value = target.value;
				break;
			case FORM_NAMES.YEAR:
				formValues.year.value = Number(target.value);
				break;
			case FORM_NAMES.MAINIMAGE:
				const file = target.files && target.files[0];

				if (file && VALID_IMAGE_TYPES.includes(file.type)) {
					formValues.mainImage.value = file;
					imagePreviews.mainImagePreview = URL.createObjectURL(file);
				}
				break;
			case FORM_NAMES.IMAGES:
				const files = target.files;
				if (files) {
					if (Array.from(files).length + formValues.images.value.length > MAX_NUM_IMAGES) {
						formValues.images.error = `Màxim ${MAX_NUM_IMAGES} imatges per projecte`;
						return;
					}

					Array.from(files).forEach(file => {
						if (VALID_IMAGE_TYPES.includes(file.type)) {
							formValues.images.value = formValues.images.value.concat(file);
						}
					});

					imagePreviews.imagesPreviews =
						formValues.images.value?.map(file => URL.createObjectURL(file)) || null;
				}
				break;
			default:
				break;
		}
	}
};

const onSubmit = (e: Event) => {
	e.preventDefault();
	console.log(formValues);
};
</script>

<template>
	<div class="create-project-modal">
		<h2>Crear un nou projecte</h2>
		<form @submit="onSubmit">
			<label :for="FORM_NAMES.NAME">
				Nom
				<input
					placeholder="Quin es el nom del projecte?"
					:name="FORM_NAMES.NAME"
					:value="formValues.name.value"
					@input="onInputChange" />
			</label>
			<label :for="FORM_NAMES.YEAR">
				Any
				<input
					type="number"
					min="2000"
					step="1"
					placeholder="Selecciona l'any"
					:max="currentYear()"
					:name="FORM_NAMES.YEAR"
					:value="formValues.year.value"
					@input="onInputChange" />
			</label>
			<label :for="FORM_NAMES.DESCRIPTION">
				Descripció
				<textarea
					maxlength="150"
					placeholder="Escriu una descripció"
					:name="FORM_NAMES.DESCRIPTION"
					:value="formValues.description.value"
					@change="onInputChange" />
			</label>

			<div class="images">
				<label
					class="image-label"
					:for="FORM_NAMES.MAINIMAGE">
					Imatge principal
					<div class="image-container">
						<picture v-if="imagePreviews.mainImagePreview">
							<img
								:src="imagePreviews.mainImagePreview"
								alt="Project Main Image Preview" />
						</picture>

						<IconPhotoPlus
							v-if="!imagePreviews.mainImagePreview"
							class="image-icon"
							stroke-width="1"
							width="30" />
						<p v-if="!imagePreviews.mainImagePreview">Selecciona una imatge</p>
						<input
							type="file"
							accept=".png, .jpg, .jpeg, .webp"
							:id="FORM_NAMES.MAINIMAGE"
							:name="FORM_NAMES.MAINIMAGE"
							@change="onInputChange" />
					</div>
				</label>
				<div class="images-list-container">
					<div class="images-list-title">
						<p>
							Resta d'imatges
							<span
								class="num-images"
								v-if="imagePreviews.imagesPreviews && imagePreviews.imagesPreviews.length > 0"
								>({{ imagePreviews.imagesPreviews.length }})</span
							>
						</p>
						<p
							class="error"
							v-if="formValues.images.error">
							{{ formValues.images.error }}
						</p>
					</div>

					<div class="images-list">
						<picture
							class="image-list-container"
							v-for="(previewUrl, index) in imagePreviews.imagesPreviews">
							<img
								v-if="imagePreviews.imagesPreviews && imagePreviews.imagesPreviews.length > 0"
								:key="`${previewUrl}-${index}`"
								:src="previewUrl"
								alt="Project Image Preview" />
						</picture>

						<label
							v-if="imagePreviews.imagesPreviews && imagePreviews.imagesPreviews.length < MAX_NUM_IMAGES"
							class="icon-container"
							:for="FORM_NAMES.IMAGES">
							<IconLibraryPlus
								class="image-icon"
								stroke-width="1"
								width="20" />
							<input
								type="file"
								accept=".png, .jpg, .jpeg, .webp"
								multiple
								:id="FORM_NAMES.IMAGES"
								:name="FORM_NAMES.IMAGES"
								@change="onInputChange" />
						</label>
					</div>
				</div>
			</div>
			<div class="action-buttons">
				<ActionButton
					text="Cancelar"
					:kind="BUTTON_KINDS.SECONDARY" />
				<ActionButton
					text="Crear projecte"
					:type="'submit'"
					:kind="BUTTON_KINDS.PRIMARY" />
			</div>
		</form>
	</div>
</template>

<style>
.create-project-modal {
	width: 90vw;
	max-width: 500px;

	height: fit-content;

	display: grid;
	place-items: center;
	gap: 0;
	color: var(--text-color);
	border-radius: var(--border-radius);

	text-align: center;
}

h2 {
	font-size: var(--font-medium);
}

form {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	width: 95%;
}

label {
	display: flex;
	flex-direction: column;
	align-items: start;
	font-weight: bold;
	gap: 0.5rem;

	color: var(--text-color);
	font-size: var(--font-small);
}

input,
textarea {
	padding: 1rem;
	width: 100%;
	border: none;
	outline: none;
	font-weight: 200;
	font-family: 'Arimo', system-ui, sans-serif;

	border: 1px solid var(--primary-light-hover);
	font-size: var(--font-small);
	border-radius: var(--border-radius);
	caret-color: var(--contrast);
	color: var(--text-color);
	background-color: var(--primary-hover);
	font-size: var(--font-small);

	transition: all 0.2s ease;
}

textarea {
	min-height: 100px;
	resize: none;
}

input::placeholder,
textarea::placeholder {
	font-size: var(--font-small);
	color: var(--text-color);
}

input:hover,
textarea:hover {
	background-color: var(--primary-light-hover);
}

input:focus-within,
textarea:focus-within {
	border: 1px solid var(--contrast);
}

picture {
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: var(--border-radius);
}

.images {
	display: flex;
	align-items: start;
	gap: 0.5rem;
	width: 100%;
}

.image-label {
	position: relative;
	width: 30%;
}

.num-images {
	font-size: var(--font-small);
	font-weight: 300;
}

.image-container {
	display: grid;
	place-items: center;
	width: 100%;
	height: 105px;
	cursor: pointer;
	border-radius: var(--border-radius);
	background-color: var(--primary-hover);
	border: 1px solid var(--primary-light-hover);

	overflow: hidden;

	transition: all 0.2s ease;
}

.icon-container input,
.image-container input {
	position: absolute;
	visibility: hidden;
}

.image-container p {
	margin: 0;
	padding: 0;
	font-weight: 200;
	font-size: var(--font-small);
	margin-top: -1.5rem;
}

.image-container:hover,
.icon-container:hover {
	background-color: var(--primary-light-hover);
}

.images-list-container {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem;
	width: 70%;
	height: 115px;
}

.images-list-title {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.images-list-title .error {
	color: red;
	font-size: 10px;
}

.images-list-container p {
	font-weight: bold;
}

.images-list {
	width: 100%;
	height: 100%;

	display: flex;
	align-items: start;
	flex-wrap: wrap;
	gap: 0.3rem;
}

.images-list picture {
	width: 50px;
	height: 50px;
}

.icon-container {
	cursor: pointer;
	height: 50px;
	width: 50px;
	display: grid;
	place-items: center;
	border-radius: var(--border-radius);
	background-color: var(--primary-hover);
	border: 1px solid var(--primary-light-hover);
}

.images-container {
	width: 40px;
	height: 40px;
	cursor: pointer;
	display: grid;
	place-items: center;
	border: 1px solid var(--primary-light-hover);
	border-radius: var(--border-radius);
	background-color: var(--primary-hover);
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	gap: 1rem;
	margin-top: 1rem;
}
</style>
