import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import { Bucket } from '../../../../bucket';
import buildLibsqlClient from '../../../../database';
import { ProjectDB, ProjectInfraResponse } from '../../common/project_types';

async function listProjectsInfra(env: Env): Promise<ProjectInfraResponse[]> {
	const client = buildLibsqlClient(env);

	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	const dbProjectRows = await selectAllProjects(client);

	return await Promise.all(
		dbProjectRows.map(async (project) => {
			const mainImage = await bucket.getItemByKey(project.main_image);
			const images = await Promise.all(project.images.split(',').map((image) => bucket.getItemByKey(image)));

			return {
				...project,
				main_image: mainImage,
				images: images,
			};
		})
	);
}

async function selectAllProjects(client: Client) {
	try {
		const dbProjects = await client.execute({
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
        GROUP BY
            projects.project_id, projects.title, projects.description, projects.year, projects.is_top, projects.created_at, projects.updated_at;
        `,
			args: [],
		});

		return dbProjects.rows as unknown as ProjectDB[];
	} catch (error: unknown) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error selecting all projects from db'}`,
			})
		);
	}
}

export default listProjectsInfra;
