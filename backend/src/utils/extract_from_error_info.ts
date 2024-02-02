function extractErrorInfo(error: unknown): { status?: number; message?: string } {
	if (error instanceof Error) {
		try {
			const parsedError = JSON.parse(error.message);
			return { status: parsedError.status, message: parsedError.message };
		} catch (jsonParseError) {
			return { status: 500, message: 'Internal Server Error' };
		}
	}

	return { status: 500, message: 'Internal Server Error' };
}

export default extractErrorInfo;
