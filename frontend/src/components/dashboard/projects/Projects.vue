<script setup lang="ts">
import ProjectModal from './ProjectModal.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import ProjectsTable from './ProjectsTable.vue';
</script>

<template>
	<ProjectsHeader />
	<section>
		<ProjectsTable />
	</section>
	<ProjectModal />
</template>

<style>
section {
	border-radius: var(--border-radius);
	box-sizing: border-box;
	height: 100%;
	width: 100%;
	background-color: var(--card-color);
	overflow-y: auto;
}
</style>
