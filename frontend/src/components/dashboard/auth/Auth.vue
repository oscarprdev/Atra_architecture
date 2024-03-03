<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

interface FormFields {
	email: string;
	password: string;
}

const formFields = reactive<FormFields>({
	email: '',
	password: '',
});

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement) {
		formFields[target.name as keyof FormFields] = target.value;
	}
};
</script>

<template>
	<section>
		<h1>Entrar al panel de control</h1>
		<form id="login-form">
			<label>
				<input
					id="email"
					autocomplete="email"
					name="email"
					required
					type="email"
					:value="formFields.email"
					@change="onInputChange"
					placeholder="Email"
				/>
			</label>
			<label>
				<input
					id="password"
					autocomplete="current-password"
					name="password"
					required
					type="password"
					:value="formFields.password"
					@change="onInputChange"
					placeholder="Contrasenya"
				/>
			</label>
			<slot name="login-btn" />
		</form>

		<Toast />
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
	margin-top: -4rem;
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
</style>
