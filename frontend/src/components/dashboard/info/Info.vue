<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { User } from '../../../api';
import InfoForm from './InfoForm.vue';
import { getUserInfo } from '../../../api/endpoints/get-user-info';
import type { InfoFormState } from './InfoForm.types';
import { updateUserInfo, type UpdateInfoPayload } from '../../../api/endpoints/update-user-info';
import SkeletonInfo from './SkeletonInfo.vue';
import { BUTTON_KINDS } from '../ActionButton.types';
import ActionButton from '../ActionButton.vue';
import { IconRotateClockwise } from '@tabler/icons-vue';
import { EMITTER_NAMES, EMITT_ACTIONS, emitter } from '../../../utils/emitter';
import Toast from '../Toast.vue';

const user = ref<User | null>(null);
const isUserLoading = ref(false);

const onSubmitInfo = async (values: InfoFormState) => {
	if (user.value && values.image.value && values.description.value) {
		const paylaod = {
			...user.value,
			image: values.image.value,
			description: values.description.value,
		} satisfies UpdateInfoPayload;

		isUserLoading.value = true;
		const userResponse = await updateUserInfo(paylaod);

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
			<h1>Informació principal</h1>
			<p>Aquesta informació apareixera a la vista de <span>Qui som</span></p>
		</header>
		<InfoForm
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
						<span class="icon">
							<IconRotateClockwise
								width="18"
								class="spinner" />
						</span>
					</template>
				</ActionButton>
			</template>
		</InfoForm>
		<SkeletonInfo v-if="!user" />
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

.icon {
	margin: 0;
	padding: 0;
	display: grid;
	place-items: center;
}
</style>
