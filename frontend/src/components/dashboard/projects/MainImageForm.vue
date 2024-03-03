<script setup lang="ts">
import { IconPhotoPlus } from '@tabler/icons-vue';

defineProps<{
	name: string;
	title: string;
	text: string;
	mainImagePreview: string;
	isBig?: boolean;
}>();

const emits = defineEmits<{
	(e: 'change', event: Event): void;
}>();
</script>

<template>
	<label
		:class="{ labelbig: isBig }"
		class="image-label"
		:for="name"
	>
		{{ title }}
		<div
			:class="{ big: isBig }"
			class="image-container"
		>
			<picture v-if="mainImagePreview">
				<img
					:src="mainImagePreview"
					alt="Project Main Image Preview"
				/>
			</picture>

			<IconPhotoPlus
				v-if="!mainImagePreview"
				class="image-icon"
				stroke-width="1"
				width="30"
			/>
			<p v-if="!mainImagePreview">{{ text }}</p>
			<input
				type="file"
				accept=".png, .jpg, .jpeg, .webp"
				:id="name"
				:name="name"
				@change="e => emits('change', e)"
			/>
			<div
				class="backdrop"
				:class="{ backdropbig: isBig }"
				v-if="mainImagePreview"
			>
				<span>
					<IconPhotoPlus
						width="30"
						stroke-width="1"
					/>
				</span>
				<p>Cambia d'imatge</p>
			</div>
		</div>
	</label>
</template>

<style scoped>
picture {
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: var(--border-radius);
}

.image-label {
	position: relative;
	width: 30%;

	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem;

	font-weight: bold;
	color: var(--text-color);
	font-size: var(--font-small);
}

.image-container {
	position: relative;
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

.big {
	height: 200px;
}

.labelbig {
	width: 50%;
	min-width: 300px;
}

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

.image-container:hover {
	background-color: var(--primary-light-hover);
}

.image-label:hover .backdrop {
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

	place-items: center;
	background-color: var(--backdrop-dark);
	color: white;

	transition: all 0.2s ease;
}

.backdrop p {
	margin: 0;
	padding: 0;
	margin-top: -3em;
}

.backdropbig p {
	margin-top: -7em;
}

.backdropbig span {
	margin-top: 3em;
}
</style>
