<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { User } from '../../../api';
import { getUserInfo } from '../../../api/endpoints/get-user-info';
import { updateUserInfo, type UpdateInfoPayload } from '../../../api/endpoints/update-user-info';
import UserForm from './UserForm.vue';
import type { UserFormState } from './UserForm.types';
import SkeletonUserForm from './SkeletonUserForm.vue';
import ActionButton from '../ActionButton.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import { IconRotateClockwise } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import Toast from '../Toast.vue';

const user = ref<User | null>(null);
const isUserLoading = ref(false);

const onSubmitInfo = async (values: UserFormState) => {
	if (user.value) {
		const payload = {
			...user.value,
			name: values.name.value,
			email: values.email.value,
			direction: values.direction.value,
			phone: values.phone.value,
		} satisfies UpdateInfoPayload;

		isUserLoading.value = true;
		const userResponse = await updateUserInfo(payload);

		if (userResponse) {
			user.value = userResponse;
			emitter.emit(EMITTER_NAMES.successToast, {
				action: EMITT_ACTIONS.SUCCESSTOAST,
				message: 'Informació actualitzada correctament',
			});
		}

		isUserLoading.value = false;
	}
};

onMounted(async () => {
	isUserLoading.value = true;
	user.value = await getUserInfo();
	isUserLoading.value = false;
});
</script>

<template>
	<section>
		<header>
			<h1>Dades personals</h1>
			<p>Informació personal de contacte que apareixera a la vista de <span>Qui som</span></p>
		</header>
		<UserForm
			v-if="user"
			:user="user"
			@submit="onSubmitInfo">
			<template #action>
				<ActionButton
					:text="`${isUserLoading ? 'Editant..' : 'Editar informació'}`"
					:type="'submit'"
					:kind="BUTTON_KINDS.PRIMARY">
					<template
						#icon
						v-if="isUserLoading">
						<IconRotateClockwise
							width="18"
							class="spinner" />
					</template>
				</ActionButton>
			</template>
		</UserForm>
		<SkeletonUserForm v-if="!user" />
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
