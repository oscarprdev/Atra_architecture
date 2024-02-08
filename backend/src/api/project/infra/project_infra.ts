import { DescribeProjectInfra } from './models/describe_project';
import { ProjectDb } from '../../common/models/project_db';
import buildLibsqlClient from '../../../database';
import extractErrorInfo from '../../../utils/extract_from_error_info';

export interface ProjectInfra {
	describeProject(input: DescribeProjectInfra.Input): Promise<DescribeProjectInfra.Output>;
}

export class DefaultProjectInfra implements ProjectInfra {
	constructor() {}

	async describeProject({ projectId, env }: DescribeProjectInfra.Input): Promise<DescribeProjectInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			const dbProject = await client.execute({
				sql: `
                SELECT
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

			if (dbProject.rows.length === 0) {
				throw new Error(
					JSON.stringify({
						status: 404,
						message: 'Projects not found',
					})
				);
			}

			return {
				project: dbProject.rows[0] as unknown as ProjectDb,
			};
		} catch (error) {
			const { status, message } = extractErrorInfo(error);

			throw new Error(
				JSON.stringify({
					status: status || 500,
					message: `Error SQL: ${error instanceof Error ? message : 'Error selecting project by id from db'}`,
				})
			);
		}
	}
}
