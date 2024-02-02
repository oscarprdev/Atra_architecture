// import sharp from 'sharp';

// async function optimizeImage(image: File): Promise<File> {
// 	try {
// 		const fileBuffer = await image.arrayBuffer();

// 		const optimizedBuffer = await sharp(fileBuffer).toFormat('webp', { quality: 80 }).toBuffer();

// 		return new File([optimizedBuffer], `${image.name}.webp`, { type: 'image/webp' });
// 	} catch (error) {
// 		throw new Error(JSON.stringify({ status: 400, message: `Error optimizing image: ${image.name}` }));
// 	}
// }

// export default optimizeImage;
