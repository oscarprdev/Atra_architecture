import hexStringToUint8Array from './hex_string_to_uin_array';

async function verifyOldPassword(inputPassword: string, hexSalt: string, hashedPassword: string): Promise<boolean> {
	const encoder = new TextEncoder();

	const inputPasswordBuffer = encoder.encode(inputPassword);

	const salt = hexStringToUint8Array(hexSalt);

	const saltedInputPassword = new Uint8Array(salt.length + inputPasswordBuffer.length);
	saltedInputPassword.set(salt, 0);
	saltedInputPassword.set(inputPasswordBuffer, salt.length);

	const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedInputPassword);

	const hashedInputPassword = Array.from(new Uint8Array(hashedBuffer))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');

	return hashedInputPassword === hashedPassword;
}

export default verifyOldPassword;
