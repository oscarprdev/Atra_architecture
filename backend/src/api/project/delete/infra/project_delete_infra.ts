import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import { Bucket } from '../../../common/s3_bucket/bucket';
import buildLibsqlClient from '../../../../database';

async function deleteProjectInfra(projectId: string, env: Env): Promise<void> {
	try {
		const client = buildLibsqlClient(env);
		const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

		// const projectDb = await selectProjectDB(projectId, client);

		// await Promise.all([
		// 	bucket.deleteItemByKey(projectDb.main_image),
		// 	...projectDb.images.split(',').map((image) => bucket.deleteItemByKey(image)),
		// 	deleteProjectDB(projectId, client),
		// ]);
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `${error instanceof Error ? error.message : 'Error handling deletion of a project'}`,
			})
		);
	}
}

async function deleteProjectDB(projectId: string, client: Client) {
	try {
		await client.execute({
			sql: `DELETE FROM images
            WHERE image_id IN (
                SELECT image_id
                FROM project_image
                WHERE project_id = ?
            );`,
			args: [projectId],
		});

		await client.execute({
			sql: `DELETE FROM project_image
            WHERE project_id = ?;`,
			args: [projectId],
		});

		await client.execute({
			sql: `DELETE FROM projects
            WHERE project_id = ?;`,
			args: [projectId],
		});
	} catch (error: unknown) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error deleting project by id from db'}`,
			})
		);
	}
}

export default deleteProjectInfra;
