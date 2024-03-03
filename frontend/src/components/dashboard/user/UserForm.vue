<script setup lang="ts">
import { reactive } from 'vue';
import type { User } from '../../../api';
import { BUTTON_KINDS } from '../ActionButton.types';
import ActionButton from '../ActionButton.vue';
import type { UserFormState } from './UserForm.types';
import InputForm from '../InputForm.vue';
import TextareaForm from '../TextareaForm.vue';

const FORM_NAMES = {
	NAME: 'name',
	EMAIL: 'email',
	PHONE: 'phone',
	DIRECTION: 'direction',
};

const props = defineProps<{
	user: User;
}>();

const emits = defineEmits<{
	(e: 'submit', values: UserFormState): void;
}>();

const formState = reactive<UserFormState>({
	name: {
		value: props.user.name,
		error: null,
	},
	email: {
		value: props.user.email,
		error: null,
	},
	phone: {
		value: props.user.phone,
		error: null,
	},
	direction: {
		value: props.user.direction,
		error: null,
	},
});

const onInputChange = (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in formState) {
		switch (target.name) {
			case FORM_NAMES.NAME:
				formState.name.value = target.value;
				break;
			case FORM_NAMES.EMAIL:
				formState.email.value = target.value;
				break;
			case FORM_NAMES.PHONE:
				formState.phone.value = Number(target.value);
				break;
			case FORM_NAMES.DIRECTION:
				formState.direction.value = target.value;
				break;
			default:
				break;
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
		<InputForm
			title="Nom"
			type="text"
			placeholder="Escriu el teu nom i cognoms"
			:name="FORM_NAMES.NAME"
			:value="formState.name.value"
			@input="onInputChange" />
		<InputForm
			title="Correu"
			type="text"
			placeholder="Quin es el teu correu?"
			:name="FORM_NAMES.EMAIL"
			:value="formState.email.value"
			@input="onInputChange" />
		<InputForm
			title="Telèfon"
			type="text"
			placeholder="Quin es el teu telèfon?"
			:name="FORM_NAMES.PHONE"
			:value="formState.phone.value.toString()"
			@input="onInputChange" />
		<InputForm
			title="Direcció"
			type="text"
			placeholder="Quin es el nom del projecte?"
			:name="FORM_NAMES.DIRECTION"
			:value="formState.direction.value"
			@input="onInputChange" />
		<div class="action">
			<slot name="action" />
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
../../../pages/api/generated
