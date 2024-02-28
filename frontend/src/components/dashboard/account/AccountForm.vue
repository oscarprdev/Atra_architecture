<script setup lang="ts">
import { reactive, watch } from 'vue';
import ErrorMessage from '../ErrorMessage.vue';
import type { AccountFormState } from './AccountForm.types';
import InputForm from '../InputForm.vue';

const FORM_NAMES = {
	OLDPASSWORD: 'oldPassword',
	FIRSTPASSWORD: 'firstPassword',
	PASSWORD: 'password',
};

const props = defineProps<{
	formState: AccountFormState;
	errorMessage: string | null;
	reset: boolean;
}>();

const emits = defineEmits<{
	(e: 'submit', values: AccountFormState): void;
}>();

const updatedFormState = reactive<AccountFormState>(props.formState);

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in updatedFormState) {
		updatedFormState[target.name as keyof AccountFormState].value = target.value;
	}
};

const onSubmit = (e: Event) => {
	e.preventDefault();

	emits('submit', updatedFormState);
};
</script>
<template>
	<form @submit="onSubmit">
		<InputForm
			title="Contrasenya vella"
			type="password"
			placeholder="xxx"
			:name="FORM_NAMES.OLDPASSWORD"
			:value="formState.oldPassword.value"
			@input="onInputChange" />
		<InputForm
			title="Nova contrasenya"
			type="password"
			placeholder="xxx"
			:name="FORM_NAMES.FIRSTPASSWORD"
			:value="formState.password.value"
			@input="onInputChange" />
		<InputForm
			title="Repeteix contrasenya"
			type="password"
			placeholder="xxx"
			:name="FORM_NAMES.PASSWORD"
			:value="formState.password.value"
			@input="onInputChange" />
		<div class="action">
			<slot name="action" />
		</div>
		<div
			v-if="errorMessage"
			class="required-message-container">
			<ErrorMessage :required-message="errorMessage" />
		</div>
	</form>
</template>

<style scoped>
form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 90%;
	max-width: 500px;
	position: relative;
}

.required-message-container {
	position: absolute;
	bottom: 5rem;
	left: 7rem;
	width: fit-content;
	padding: 0.5rem;
	background-color: white;
	border-radius: 0.2rem;
	opacity: 1;
	visibility: hidden;

	animation: fadeup-down 4s linear forwards;
}
</style>
