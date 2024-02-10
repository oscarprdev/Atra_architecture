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

	protected async verifyPassword(inputPassword: string, hexSalt: string, hashedPassword: string): Promise<boolean> {
		const encoder = new TextEncoder();

		const inputPasswordBuffer = encoder.encode(inputPassword);

		const salt = this.hexStringToUint8Array(hexSalt);

		const saltedInputPassword = new Uint8Array(salt.length + inputPasswordBuffer.length);
		saltedInputPassword.set(salt, 0);
		saltedInputPassword.set(inputPasswordBuffer, salt.length);

		const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedInputPassword);

		const hashedInputPassword = Array.from(new Uint8Array(hashedBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');

		return hashedInputPassword === hashedPassword;
	}
}
