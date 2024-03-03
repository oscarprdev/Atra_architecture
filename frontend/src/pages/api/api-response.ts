export interface ApiResponse<T> {
	status: number;
	response: string;
	data: T;
}
