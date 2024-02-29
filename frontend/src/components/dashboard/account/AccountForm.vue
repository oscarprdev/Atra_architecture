<script setup lang="ts">
import { reactive } from 'vue';
import ErrorMessage from '../ErrorMessage.vue';
import type { AccountFormState } from './AccountForm.types';
import InputForm from '../InputForm.vue';
import { validatePassword } from '../../../api/endpoints/validate-password';
import { IconCircleCheckFilled } from '@tabler/icons-vue';

const MINIMUM_PASSWORD_LENGTH = 6;
const CHECK_MESSAGES = {
	hasNumbers: 'Un nombre',
	hasUppercase: 'Una lletra majúscula',
	isLargerEnough: `Mínim ${MINIMUM_PASSWORD_LENGTH} caràcters`,
	sameAsOldPassword: 'La nova contrasenya deu ser distinta a la actual',
};
const ERROR_MESSAGES = {
	oldPassword: 'Oops.. la contrasenya no es correcta',
	password: 'No coincideix amb la nova contrasenya',
};
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

const onInputChange = async (e: Event) => {
	const target = e.target;
	if (target instanceof HTMLInputElement && target.name in updatedFormState) {
		updatedFormState[target.name as keyof AccountFormState].value = target.value;

		switch (target.name) {
			case FORM_NAMES.OLDPASSWORD:
				if (target.value.length > 0) {
					const response = await validatePassword({ oldPassword: target.value });
					updatedFormState.oldPassword.state.isValid = response || false;
					updatedFormState.oldPassword.error = ERROR_MESSAGES.oldPassword;
				} else {
					updatedFormState.oldPassword.state.isValid = false;
					updatedFormState.oldPassword.error = null;
				}

				break;
			case FORM_NAMES.FIRSTPASSWORD:
				const firstPasswordIsSameAsOldPassword = updatedFormState.oldPassword.value === target.value;
				const firstPasswordhasNumbers = /\d/.test(target.value);
				const firstPasswordhasUppercase = /[A-Z]/.test(target.value);
				const firstPasswordisLargeEnough = target.value.length >= MINIMUM_PASSWORD_LENGTH;

				updatedFormState.firstPassword.state.hasNumber = firstPasswordhasNumbers;
				updatedFormState.firstPassword.state.hasUppercase = firstPasswordhasUppercase;
				updatedFormState.firstPassword.state.isLargerEnough = firstPasswordisLargeEnough;
				updatedFormState.firstPassword.state.isValid =
					firstPasswordhasNumbers &&
					firstPasswordhasUppercase &&
					firstPasswordisLargeEnough &&
					!firstPasswordIsSameAsOldPassword;

				if (
					firstPasswordhasNumbers &&
					firstPasswordhasUppercase &&
					firstPasswordisLargeEnough &&
					firstPasswordIsSameAsOldPassword
				) {
					updatedFormState.firstPassword.error = CHECK_MESSAGES.sameAsOldPassword;
				} else {
					updatedFormState.firstPassword.error = null;
				}

				break;
			case FORM_NAMES.PASSWORD:
				const passwordhasNumbers = /\d/.test(target.value);
				const passwordhasUppercase = /[A-Z]/.test(target.value);
				const passwordisLargeEnough = target.value.length >= MINIMUM_PASSWORD_LENGTH;
				const passwordMatchWithFirstPassword =
					updatedFormState.firstPassword.value === updatedFormState.password.value;

				updatedFormState.password.state.hasNumber = passwordhasNumbers;
				updatedFormState.password.state.hasUppercase = passwordhasUppercase;
				updatedFormState.password.state.isLargerEnough = passwordisLargeEnough;

				updatedFormState.password.state.isValid =
					passwordhasNumbers &&
					passwordhasUppercase &&
					passwordisLargeEnough &&
					passwordMatchWithFirstPassword;

				updatedFormState.password.error =
					passwordhasNumbers &&
					passwordhasUppercase &&
					passwordisLargeEnough &&
					!passwordMatchWithFirstPassword
						? ERROR_MESSAGES.password
						: null;
				break;
			default:
				break;
		}
	}
};

const onSubmit = (e: Event) => {
	e.preventDefault();

	emits('submit', updatedFormState);
};
</script>
<template>
	<form @submit="onSubmit">
		<div class="password-wrapper">
			<InputForm
				title="Contrasenya vella"
				type="password"
				placeholder="Introdueix la contrasenya actual"
				:has-error="!!formState.oldPassword.error && !formState.oldPassword.state.isValid"
				:name="FORM_NAMES.OLDPASSWORD"
				:value="formState.oldPassword.value"
				@input="onInputChange">
				<template
					v-if="formState.oldPassword.state.isValid"
					#icon-title>
					<span class="icon-wrapper">
						<IconCircleCheckFilled width="18" />
					</span>
				</template>
			</InputForm>
			<p
				class="error-message"
				v-if="!!formState.oldPassword.error && !formState.oldPassword.state.isValid">
				{{ formState.oldPassword.error }}
			</p>
		</div>

		<div class="password-wrapper">
			<InputForm
				title="Nova contrasenya"
				type="password"
				placeholder="Introdueix la nova contrasenya"
				:has-error="formState.firstPassword.value.length > 0 && !formState.firstPassword.state.isValid"
				:name="FORM_NAMES.FIRSTPASSWORD"
				:value="formState.firstPassword.value"
				@input="onInputChange">
				<template
					v-if="formState.firstPassword.state.isValid"
					#icon-title>
					<span class="icon-wrapper">
						<IconCircleCheckFilled width="18" />
					</span>
				</template>
			</InputForm>
			<p
				class="error-message"
				v-if="formState.firstPassword.error">
				{{ formState.firstPassword.error }}
			</p>
			<div
				v-if="formState.firstPassword.value.length > 0"
				class="validations">
				<ul>
					<li :class="{ valid: formState.firstPassword.state.hasUppercase }">
						{{ CHECK_MESSAGES.hasUppercase }}
					</li>
					<li :class="{ valid: formState.firstPassword.state.isLargerEnough }">
						{{ CHECK_MESSAGES.isLargerEnough }}
					</li>
					<li :class="{ valid: formState.firstPassword.state.hasNumber }">
						{{ CHECK_MESSAGES.hasNumbers }}
					</li>
				</ul>
			</div>
		</div>

		<div class="password-wrapper">
			<InputForm
				title="Repeteix contrasenya"
				type="password"
				placeholder="Introdueix altra vegada la nova contrasenya"
				:has-error="formState.password.value.length > 0 && !formState.password.state.isValid"
				:name="FORM_NAMES.PASSWORD"
				:value="formState.password.value"
				@input="onInputChange">
				<template
					v-if="formState.password.state.isValid"
					#icon-title>
					<span class="icon-wrapper">
						<IconCircleCheckFilled width="18" />
					</span>
				</template>
			</InputForm>
			<p
				class="error-message"
				v-if="!!formState.password.error && !formState.password.state.isValid">
				{{ formState.password.error }}
			</p>
			<div
				v-if="formState.password.value.length > 0"
				class="validations">
				<ul>
					<li :class="{ valid: formState.password.state.hasUppercase }">
						{{ CHECK_MESSAGES.hasUppercase }}
					</li>
					<li :class="{ valid: formState.password.state.isLargerEnough }">
						{{ CHECK_MESSAGES.isLargerEnough }}
					</li>
					<li :class="{ valid: formState.password.state.hasNumber }">
						{{ CHECK_MESSAGES.hasNumbers }}
					</li>
				</ul>
			</div>
		</div>

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

.icon-wrapper {
	color: var(--contrast);
	position: absolute;
	right: -1.4rem;
	top: -0.2rem;
	opacity: 0;

	animation: fadeup 0.1s linear forwards;
}

.error-message {
	opacity: 0;
	margin-top: 0.7rem;
	font-size: var(--font-small);
	color: var(--danger-text);
	animation: fadeup 0.4s linear forwards;
}

.validations ul {
	list-style: inside;
}

.validations {
	opacity: 0;
	margin-left: -2rem;
	font-size: 0.7rem;
	color: var(--text-color-disabled);

	animation: fadeup 0.4s linear forwards;
}

.validations .valid {
	color: var(--text-color);
	font-weight: 400;
}
</style>
