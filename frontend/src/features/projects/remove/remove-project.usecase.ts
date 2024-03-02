export const removeProjectUsecase = async (projectId: string) => {
	const response = await fetch('/api/remove-project', {
		method: 'DELETE',
		body: JSON.stringify(projectId),
	});

	if (response.status !== 201) {
		const jsonResponse = await response.json();

		throw new Error(jsonResponse.message);
	}
};
