<script setup lang="ts">
import { IconLibraryPlus, IconX } from '@tabler/icons-vue';

defineProps<{
	name: string;
	title: string;
	error: string | null;
	imagesPreviews: string[] | null;
	maxNumImages: number;
}>();
const emits = defineEmits<{
	(e: 'change', event: Event): void;
	(e: 'remove', id: number): void;
}>();
</script>

<template>
	<div class="images-list-container">
		<div class="images-list-title">
			<p>
				{{ title }}
				<span
					class="num-images"
					v-if="imagesPreviews && imagesPreviews.length > 0"
					>({{ imagesPreviews.length }})</span
				>
			</p>
			<p
				class="error"
				v-if="error">
				{{ error }}
			</p>
		</div>

		<div class="images-list">
			<picture
				class="image-list-container"
				v-for="(previewUrl, index) in imagesPreviews">
				<img
					v-if="imagesPreviews && imagesPreviews.length > 0"
					:key="`${previewUrl}-${index}`"
					:src="previewUrl"
					alt="Project Image Preview" />
				<div
					class="backdrop"
					@click="emits('remove', index)">
					<IconX
						width="30"
						stroke-width="1" />
				</div>
			</picture>

			<label
				v-if="imagesPreviews && imagesPreviews.length < maxNumImages"
				class="icon-container"
				:for="name">
				<IconLibraryPlus
					class="image-icon"
					stroke-width="1"
					width="20" />
				<input
					type="file"
					accept=".png, .jpg, .jpeg, .webp"
					multiple
					:id="name"
					:name="name"
					@change="e => emits('change', e)" />
			</label>
		</div>
	</div>
</template>

<style scoped>
picture {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: var(--border-radius);
}

.images-list-container {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem;
	width: 70%;
	height: 115px;
}

.images-list-container p {
	font-weight: bold;
}

.images-list-title {
	display: flex;
	align-items: center;
	gap: 1rem;
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

.icon-container input {
	position: absolute;
	visibility: hidden;
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

.num-images {
	font-size: var(--font-small);
	font-weight: 300;
}

.error {
	color: red;
	font-size: 10px;
}

.icon-container:hover {
	background-color: var(--primary-light-hover);
}

.images-list picture:hover .backdrop {
	opacity: 1;
}

.backdrop {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
	width: 100%;
	height: 100%;
	display: grid;
	z-index: 9000;
	cursor: pointer;

	place-items: center;
	background-color: var(--backdrop-dark);
	color: white;

	transition: all 0.2s ease;
}
</style>
