function convertToBoolean(input: string | File | null) {
	return input?.toString() === 'true';
}

export default convertToBoolean;
