import hexStringToUint8Array from './hex_string_to_uin_array';

async function hashPassword(password: string, hexSalt: string): Promise<string> {
	const encoder = new TextEncoder();

	const passwordBuffer = encoder.encode(password);

	const salt = hexStringToUint8Array(hexSalt);

	const saltedPassword = new Uint8Array(salt.length + passwordBuffer.length);
	saltedPassword.set(salt, 0);
	saltedPassword.set(passwordBuffer, salt.length);

	const hashedBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);

	const hashedPassword = Array.from(new Uint8Array(hashedBuffer))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');

	return hashedPassword;
}

export default hashPassword;
