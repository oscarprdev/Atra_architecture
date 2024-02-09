export class UserUsecases {
	constructor() {}

	protected hexStringToUint8Array(hexString?: string): Uint8Array {
		const hex = hexString || crypto.randomUUID().toString();

		const length = hex.length / 2;
		const uint8Array = new Uint8Array(length);

		for (let i = 0; i < length; i++) {
			const byte = parseInt(hex.substr(i * 2, 2), 16);
			uint8Array[i] = byte;
		}

		return uint8Array;
	}

	protected generateImageKey(project: string) {
		const imageId = crypto.randomUUID().toString();
		const projectName = project.replaceAll(' ', '_');

		return `${projectName}/${imageId}`;
	}
}
