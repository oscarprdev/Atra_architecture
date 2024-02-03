import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import { Bucket } from '../../../../bucket';
import buildLibsqlClient from '../../../../database';
import { ProjectDB, ProjectInfraResponse } from '../../common/project_types';

async function describeProjectInfra(projectId: string, env: Env): Promise<ProjectInfraResponse> {
	const client = buildLibsqlClient(env);
	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	// Select project from db
	const projectDB = await selectProjectDB(projectId, client);

	// Map project db images keys with cloudflare bucket
	const [mainImage, images] = await Promise.all([
		bucket.getItemByKey(projectDB.main_image),
		Promise.all(projectDB.images.split(',').map((image) => bucket.getItemByKey(image))),
	]);

	return {
		...projectDB,
		main_image: mainImage,
		images,
	};
}

export async function selectProjectDB(projectId: string, client: Client) {
	try {
		const dbProject = await client.execute({
			sql: `SELECT
            projects.project_id,
            projects.title,
            projects.description,
            projects.year,
            projects.is_top,
            projects.created_at,
            projects.updated_at,
            GROUP_CONCAT(
                CASE WHEN images.is_main = 0 THEN images.key END
            ) AS images,
            MAX(CASE WHEN images.is_main = 1 THEN images.key END) AS main_image
        FROM
            projects
        JOIN
            project_image ON projects.project_id = project_image.project_id
        JOIN
            images ON project_image.image_id = images.image_id
        WHERE projects.project_id = ?
        GROUP BY
            projects.project_id, projects.title, projects.description, projects.year, projects.is_top, projects.created_at, projects.updated_at;
        `,
			args: [projectId],
		});

		return dbProject.rows[0] as unknown as ProjectDB;
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error selecting project by id from db'}`,
			})
		);
	}
}

export default describeProjectInfra;
