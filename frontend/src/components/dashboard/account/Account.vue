<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { IconRotateClockwise } from '@tabler/icons-vue';
import AccountForm from './AccountForm.vue';
import type { AccountFormState } from './AccountForm.types';
import { type UpdatePasswordInput, updatePassword } from '../../../api/endpoints/update-password';
import { validateRoute } from '../../../utils/validateRoute';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import Toast from '../Toast.vue';

const isPasswordLoading = ref(false);
const error = ref<string | null>(null);

const formState = reactive<AccountFormState>({
	oldPassword: {
		value: '',
		error: null,
		state: {
			isValid: false,
		},
	},

	firstPassword: {
		value: '',
		error: null,
		state: {
			isValid: false,
			isLargerEnough: false,
			hasNumber: false,
			hasUppercase: false,
		},
	},

	password: {
		value: '',
		error: null,
		state: {
			isValid: false,
			isLargerEnough: false,
			hasNumber: false,
			hasUppercase: false,
		},
	},
});

const isFormFullfilled = computed(() => {
	return (
		formState.firstPassword.state.isValid && formState.oldPassword.state.isValid && formState.password.state.isValid
	);
});

const cleanForm = () => {
	Object.values(formState).forEach(field => {
		field.state.isValid = false;
		field.value = '';
		field.error = null;
	});
};

const setErrorMessage = (message: string) => {
	error.value = message;

	setTimeout(() => {
		error.value = null;
	}, 3000);
};

const onSubmitPassword = async (values: AccountFormState) => {
	if (values.firstPassword.value !== values.password.value) {
		setErrorMessage('Les contrasenyes no coincideixen');
		return;
	}

	if (values.password.value === values.oldPassword.value) {
		setErrorMessage('La nova contrasenya deu ser diferent a la vella');
		return;
	}

	const payload = {
		oldPassword: values.oldPassword.value,
		password: values.password.value,
	} satisfies UpdatePasswordInput;

	isPasswordLoading.value = true;
	const response = await updatePassword(payload);
	isPasswordLoading.value = false;

	if (response) {
		emitter.emit(EMITTER_NAMES.successToast, {
			action: EMITT_ACTIONS.SUCCESSTOAST,
			message: 'Contrasenya actualitzada correctament',
		});
		cleanForm();
	}
};

onMounted(async () => {
	await validateRoute();
});
</script>

<template>
	<section>
		<header>
			<h1>Compte</h1>
			<p>Actualitzar contrasenya</p>
		</header>
		<AccountForm
			:error-message="error"
			:form-state="formState"
			:reset="!isPasswordLoading"
			@submit="onSubmitPassword">
			<template #action>
				<ActionButton
					:text="`${isPasswordLoading ? 'Actualitzant contrasenya' : 'Actualitzar contrasenya'}`"
					:type="'submit'"
					:disabled="!isFormFullfilled"
					:kind="BUTTON_KINDS.DANGER">
					<template
						#icon
						v-if="isPasswordLoading">
						<IconRotateClockwise
							width="18"
							class="spinner" />
					</template>
				</ActionButton>
			</template>
		</AccountForm>
		<Toast />
	</section>
</template>

<style scoped>
section {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding: 0 2rem;

	box-sizing: border-box;
	height: 100%;
	width: 100%;

	background-color: var(--primary);
	color: var(--text-color);
	border-radius: var(--border-radius);
}

header {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	color: var(--text-color);
}

header p {
	margin: 0;
	padding: 0;
	margin-top: -1.5rem;
}

header span {
	font-weight: bold;
}
</style>
