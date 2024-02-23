<script setup lang="ts">
import { currentYear } from '../../../utils/currentYear';
</script>

<template>
	<div class="create-project-modal">
		<h2>Crear un nou projecte</h2>
		<form>
			<label>
				Nom
				<input placeholder="Quin es el nom del projecte?" />
			</label>
			<label>
				Any
				<input
					type="number"
					min="2000"
					:max="currentYear()"
					step="1"
					placeholder="Selecciona l'any" />
			</label>
			<label>
				Descripció
				<textarea
					maxlength="150"
					placeholder="Escriu una descripció" />
			</label>
		</form>
	</div>
</template>

<style>
.create-project-modal {
	width: 90vw;
	max-width: 600px;

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

	width: 80%;
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
	font-weight: 100;
	border: 1px solid transparent;
	font-family: 'Arimo', system-ui, sans-serif;

	font-size: var(--font-small);
	border-radius: var(--border-radius);
	caret-color: var(--contrast);
	color: var(--text-color);
	background-color: var(--primary-hover);
	font-size: var(--font-small);
}

textarea {
	min-height: 100px;
	resize: none;
}

input::placeholder,
textarea::placeholder {
	color: var(--text-color);
}

input:focus-within,
textarea:focus-within {
	border: 1px solid var(--contrast);
}
</style>
