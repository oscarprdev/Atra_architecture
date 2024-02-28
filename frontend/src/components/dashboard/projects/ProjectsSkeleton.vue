<template>
	<tr class="row-skeleton">
		<span aria-hidden="true"></span>
		<td class="row-image-skeleton"></td>
		<td></td>
		<td class="row-description-skeleton"></td>
		<td></td>
		<td></td>
		<td class="row-action-skeleton"></td>
	</tr>
</template>

<style scoped>
span {
	width: 1.3rem;
	height: 1.3rem;
	margin-left: 2rem;
}

tr {
	display: flex;
	align-items: center;
	margin: 0 2rem;
	height: 82px;
	gap: 2.4rem;
	border-bottom: 1px solid var(--primary-light);
}

td {
	padding: 0.8rem 1.5rem;
	width: 130px;
	background-color: var(--primary);
	border-radius: 0.5rem;
}

.row-image-skeleton {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.row-description-skeleton {
	width: 250px;
}

.row-action-skeleton {
	height: 40px;
	margin-left: 2.2rem;
}

span,
td {
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
