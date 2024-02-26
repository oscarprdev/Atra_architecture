<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { API_URL } from '../../constants';

interface FormFields {
	email: string;
	password: string;
}

const DASHBOARD_URL = '/auth/dashboard';
const LOCALSTORAGE_ITEM = 'jwt';

const formFields = reactive({
	email: '',
	password: '',
});
const erroMessage = ref(null);

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement) {
		formFields[target.name as keyof FormFields] = target.value;
	}
};
const onSubmit = async (e: Event) => {
	e.preventDefault();

	const response = await fetch(`${API_URL}/user/login`, {
		method: 'POST',
		body: JSON.stringify(formFields),
	});

	const jsonResponse = await response.json();

	if (jsonResponse.status !== 201) {
		erroMessage.value = jsonResponse;
	} else {
		localStorage.setItem(LOCALSTORAGE_ITEM, jsonResponse.data);
		window.location.replace(DASHBOARD_URL);
	}
};

onMounted(() => {
	const jwt = localStorage.getItem(LOCALSTORAGE_ITEM);

	if (jwt) {
		window.location.replace(DASHBOARD_URL);
	}
});
</script>

<template>
	<section>
		<h1>Entrar al panel de control</h1>
		<form @submit="onSubmit">
			<label>
				<input
					autocomplete="email"
					name="email"
					required
					type="email"
					:value="formFields.email"
					@change="onInputChange"
					placeholder="Email" />
			</label>
			<label>
				<input
					autocomplete="current-password"
					name="password"
					required
					type="password"
					:value="formFields.password"
					@change="onInputChange"
					placeholder="Contrasenya" />
			</label>
			<button type="submit">Login</button>
			<p
				class="error-message"
				v-if="erroMessage">
				{{ erroMessage }}
			</p>
		</form>
	</section>
</template>

<style>
section {
	display: grid;
	place-items: center;
	width: 90vw;
	height: 50vh;
	max-width: var(--max-width);
}

form {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.8rem;
	width: 100%;
	max-width: 350px;
}

label {
	width: 100%;
}

input {
	width: 100%;
	padding: 1rem;
	border: 1px solid var(--color);
	color: var(--color);
	border-radius: 0.3rem;
	font-size: 1rem;
}

input:focus {
	outline: 1px solid rgb(42, 42, 42);
}

button {
	width: 100%;
	padding: 1rem;
	border: 1px solid var(--color);
	border-radius: 0.3rem;
	font-size: 1rem;
	background-color: rgb(42, 42, 42);
	cursor: pointer;
	color: azure;
	transition: all 0.2s ease;
}

button:hover {
	background-color: rgb(14, 14, 14);
}

.error-message {
	position: absolute;
	bottom: -3rem;
	color: rgb(224, 13, 13);
}
</style>
