function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
	const binary = [];
	const bytes = new Uint8Array(arrayBuffer);
	for (let i = 0; i < bytes.length; i++) {
		binary.push(String.fromCharCode(bytes[i]));
	}
	return btoa(binary.join(''));
}

export default arrayBufferToBase64;
