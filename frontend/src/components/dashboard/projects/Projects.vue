<script setup lang="ts">
import ProjectModal from './ProjectModal.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import ProjectsTable from './ProjectsTable.vue';
import Toast from '../Toast.vue';
</script>

<template>
	<ProjectsHeader />
	<section>
		<ProjectsTable />
	</section>
	<ProjectModal />
	<Toast />
</template>

<style>
section {
	border-radius: var(--border-radius);
	box-sizing: border-box;
	height: 100%;
	width: 100%;
	background-color: var(--primary);
	overflow-y: auto;
}
</style>
