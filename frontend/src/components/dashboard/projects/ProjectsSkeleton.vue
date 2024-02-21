<template>
	<tr class="row-skeleton">
		<span></span>
		<td class="row-image-skeleton"></td>
		<td></td>
		<td class="row-description-skeleton"></td>
		<td></td>
		<td></td>
	</tr>
</template>

<style scoped>
span {
	background-color: var(--card-hover-color);
	border-radius: 4px;

	width: 1.3rem;
	height: 1.3rem;
	margin-left: 2rem;
	width: 1.3rem;
	height: 1.3rem;
}
tr {
	display: flex;
	align-items: center;
	margin: 1.2rem 2rem;
	padding-bottom: 1.2rem;
	gap: 2.4rem;
	border-bottom: 1px solid var(--card-hover-color);
}

td {
	padding: 0.8rem 1.5rem;
	width: 130px;
	background-color: var(--card-hover-color);
	border-radius: 0.5rem;
}

tr:hover {
	background-color: transparent;
}

.row-image-skeleton {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.row-description-skeleton {
	width: 250px;
}
</style>
