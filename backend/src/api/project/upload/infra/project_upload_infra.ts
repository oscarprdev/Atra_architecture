import { Client, Value } from '@libsql/client/web';
import buildLibsqlClient from '../../../../database';
import { Env } from '../../../..';
import { uploadImages, uploadMainImage } from './project_upload_infra_images';

interface UploadProjectToInfraInput {
	title: string;
	year: number;
	description: string;
	isTop: boolean;
	mainImage: File;
	images: File[];
}

interface InsertProjectToDbInput {
	title: string;
	year: number;
	description: string;
	isTop: boolean;
}

interface InsertImagesToDbInput {
	key?: string;
	isMain: boolean;
	projectId: Value;
}

interface InsertRelationProjectImageInput {
	projectId: Value;
	imageId: string;
}

async function uploadProjectToInfra({ title, description, year, isTop, mainImage, images }: UploadProjectToInfraInput, env: Env) {
	const client = buildLibsqlClient(env);

	const [mainImageUploaded, imagesUploaded, dbProject] = await Promise.all([
		uploadMainImage(mainImage, title, env),
		uploadImages(images, title, env),
		insertProjectToDb({ title, description, year, isTop }, client),
	]);

	// Insert images to db
	await Promise.all([
		insertImageToDb({ key: mainImageUploaded?.Key, isMain: true, projectId: dbProject.project_id }, client),
		...imagesUploaded.map((image) => insertImageToDb({ key: image?.Key, isMain: false, projectId: dbProject.project_id }, client)),
	]);

	return {
		...dbProject,
		mainImage: mainImageUploaded,
		images: imagesUploaded,
	};
}

async function insertProjectToDb({ title, description, year, isTop }: InsertProjectToDbInput, client: Client) {
	try {
		const projectId = crypto.randomUUID().toString();

		await client.execute({
			sql: `INSERT INTO projects (project_id, title, description, year, is_top)
            VALUES (?, ?, ?, ?, ?)`,
			args: [projectId, title, description, year, isTop],
		});

		const dbProject = await client.execute({
			sql: `SELECT * FROM projects WHERE project_id = ?;`,
			args: [projectId],
		});

		return dbProject.rows[0];
	} catch (error) {
		throw new Error(JSON.stringify({ status: 500, message: 'Error inserting project to DB' }));
	}
}

async function insertImageToDb({ key, isMain, projectId }: InsertImagesToDbInput, client: Client) {
	if (!key) {
		throw new Error(JSON.stringify({ status: 500, message: 'Error: Image bucket key undefined' }));
	}

	try {
		const imageId = crypto.randomUUID().toString();

		await client.execute({
			sql: `INSERT INTO images (image_id, key, is_main)
            VALUES (?, ?, ?)`,
			args: [imageId, key, isMain],
		});

		const dbImage = await client.execute({
			sql: `SELECT * FROM images WHERE image_id = ?;`,
			args: [imageId],
		});

		await insertRelationProjectImage({ projectId, imageId }, client);

		return dbImage.rows[0];
	} catch (error) {
		throw new Error(JSON.stringify({ status: 500, message: 'Error inserting images to DB' }));
	}
}

async function insertRelationProjectImage({ projectId, imageId }: InsertRelationProjectImageInput, client: Client) {
	try {
		const response = await client.execute({
			sql: `INSERT INTO project_image (project_id, image_id)
            VALUES (?, ?)`,
			args: [projectId, imageId],
		});

		return response.rows[0];
	} catch (error) {
		throw new Error(JSON.stringify({ status: 500, message: 'Error relationing project with image in DB' }));
	}
}

export default uploadProjectToInfra;
