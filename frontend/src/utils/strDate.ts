import { strCapitalized } from './strCapitalized';

export const strDate = (dateString: string) => {
	const date = new Intl.DateTimeFormat('ca-ES', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	}).format(new Date(dateString));

	return date
		.split(' ')
		.map((str, i) => (i === 2 ? strCapitalized(str) : str))
		.join(' ');
};
