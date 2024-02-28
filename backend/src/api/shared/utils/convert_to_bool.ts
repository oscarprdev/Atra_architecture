function convertToBoolean(input: string | File | null) {
	return input ? input?.toString() === 'true' : undefined;
}

export default convertToBoolean;
