<template>
	<section class="skeleton-container">
		<div class="title-image"></div>
		<div class="image"></div>
		<div class="title-description"></div>
		<div class="description"></div>
		<div class="button"></div>
	</section>
</template>

<style scoped>
.skeleton-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 90%;
	margin-left: -2rem;
}

.title-image {
	width: 200px;
	height: 30px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}

.image {
	width: 500px;
	height: 150px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}

.description {
	width: 700px;
	height: 200px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}

.button {
	width: 150px;
	height: 50px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}

.title-description {
	width: 250px;
	height: 30px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}
div {
	background-image: linear-gradient(
		90deg,
		var(--primary-hover) 25%,
		var(--primary-light) 50%,
		var(--primary-hover) 75%
	);
	background-size: 300px 100%;
	animation: skeleton-loading 4s infinite linear;
	border-radius: 0.5rem;
}
</style>
