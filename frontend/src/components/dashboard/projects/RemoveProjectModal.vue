<script setup lang="ts">
import type { Project } from '../../../api';

defineProps<{
	projects: Project[];
}>();
</script>

<template>
	<div class="remove-project-modal">
		<h2>Estas segur que vols eliminar els projectes seleccionats?</h2>
		<div class="modal-actions">
			<button>Cancelar</button>
			<button>Eliminar</button>
		</div>
	</div>
</template>

<style scoped>
.remove-project-modal {
	width: 90vw;
	max-width: 300px;

	height: fit-content;

	display: grid;
	place-items: center;
	gap: 0;
	color: var(--text-color);
	border-radius: var(--border-radius);

	text-align: center;
}

h2 {
	font-size: var(--font-small);
	width: 100%;
	font-weight: 200;
}

ul {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 0;

	width: 100%;
	height: 100%;
}

li {
	display: flex;
	align-items: center;
	gap: 1rem;

	width: 100%;
	height: 100%;
}

picture {
	display: grid;
	place-items: center;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	overflow: hidden;
}

img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.modal-actions {
	display: flex;
	align-items: center;
	gap: 2rem;
}

button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: var(--font-small);
	padding: 0.5rem 1.2rem;
	border-radius: 0.3rem;
	cursor: pointer;

	min-width: 80px;

	border: 1px solid var(--dropdown-text-color);
	background-color: var(--dropdown-bg-color);
	color: var(--dropdown-text-color);
}
</style>
