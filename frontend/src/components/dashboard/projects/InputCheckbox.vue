<script setup lang="ts">
defineProps<{
	id: string;
	checked: boolean;
}>();

const emit = defineEmits<{
	(e: 'onClick', id: string): void;
}>();
</script>

<template>
	<div class="custom-checkbox">
		<input
			type="checkbox"
			:id="id"
			:checked="checked"
		/>
		<label
			:id="id"
			class="checkbox-mark"
			@click="emit('onClick', id)"
		/>
	</div>
</template>

<style scoped>
.custom-checkbox {
	margin-left: 2rem;
	width: 1.3rem;
	height: 1.3rem;
	position: relative;
}
.custom-checkbox label {
	width: 1.3rem;
	height: 1.3rem;
	cursor: pointer;
	position: absolute;
	top: 0;
	left: 0;
	background-color: var(--primary);
	border: 1px solid var(--primary-light);
	border-radius: 4px;
}
.custom-checkbox label:after {
	content: '';
	width: 9px;
	height: 5px;
	position: absolute;
	top: calc(50% - 2.5px);
	left: calc(50% - 4.5px);
	border: 3px solid var(--text-color);
	border-top: none;
	border-right: none;
	background-color: transparent;
	opacity: 0;
	-webkit-transform: rotate(-45deg);
	transform: rotate(-45deg);
	transition: all 0.1s linear;
}
.custom-checkbox label:hover::after {
	opacity: 0.3;
}
.custom-checkbox input[type='checkbox'] {
	visibility: hidden;
	top: 0;
	left: 0;
	position: absolute;
}
.custom-checkbox input[type='checkbox']:checked + label:after {
	opacity: 1;
}
</style>
