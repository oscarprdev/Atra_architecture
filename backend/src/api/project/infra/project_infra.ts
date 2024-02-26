import { DescribeProjectInfra } from './models/describe_project';
import { ImageDb, ProjectDb } from '../shared/project_types';
import buildLibsqlClient from '../../../database';
import extractErrorInfo from '../../shared/utils/extract_from_error_info';
import { CreateProjectInfra } from './models/create_project';
import { InsertImageInfra } from './models/insert_image';
import { ListProjectInfra } from './models/list_project';
import { DeleteProjectInfra } from './models/delete_project';
import { DeleteImageInfra } from './models/delete_image';
import { UpdateProjectInfra } from './models/update_project';

export interface ProjectInfra {
	describeProject(input: DescribeProjectInfra.Input): Promise<DescribeProjectInfra.Output>;

	createProject(input: CreateProjectInfra.Input): Promise<CreateProjectInfra.Output>;
	updateProject(input: UpdateProjectInfra.Input): Promise<UpdateProjectInfra.Output>;

	insertImage(input: InsertImageInfra.Input): Promise<void>;

	listProject(input: ListProjectInfra.Input): Promise<ListProjectInfra.Output>;

	deleteProject(input: DeleteProjectInfra.Input): Promise<DeleteProjectInfra.Output>;
	deleteImage(input: DeleteImageInfra.Input): Promise<void>;
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

	async createProject({ projectId, title, description, year, isTop, env }: CreateProjectInfra.Input): Promise<CreateProjectInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			await client.execute({
				sql: `INSERT INTO projects (project_id, title, description, year, is_top)
				VALUES (?, ?, ?, ?, ?)`,
				args: [projectId, title, description, year, isTop],
			});

			const dbProject = await client.execute({
				sql: `SELECT * FROM projects WHERE project_id = ?;`,
				args: [projectId],
			});

			return {
				project: dbProject.rows[0] as unknown as ProjectDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error inserting project to DB'}`,
				})
			);
		}
	}

	async updateProject({ projectId, title, description, year, isTop, env }: UpdateProjectInfra.Input): Promise<UpdateProjectInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			await client.execute({
				sql: `UPDATE projects
				SET title = ?, 
					description = ?, 
					year = ?, 
					is_top = ?,
					updated_at = CURRENT_TIMESTAMP
				WHERE project_id = ?;`,
				args: [title, description, year, isTop, projectId],
			});

			const dbProject = await client.execute({
				sql: `SELECT * FROM projects WHERE project_id = ?;`,
				args: [projectId],
			});

			return {
				project: dbProject.rows[0] as unknown as ProjectDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error updating project to DB'}`,
				})
			);
		}
	}

	async insertImage({ key, projectId, isMain, env }: InsertImageInfra.Input): Promise<void> {
		try {
			const client = buildLibsqlClient(env);

			if (isMain) {
				const currentMainImageIdResult = await client.execute({
					sql: `SELECT images.image_id FROM images
					INNER JOIN project_image ON images.image_id = project_image.image_id
					WHERE project_image.project_id = ? AND images.is_main = ?`,
					args: [projectId, true],
				});

				console.log('current main image db', currentMainImageIdResult);

				if (currentMainImageIdResult.rows.length > 0) {
					const currentMainImageId = currentMainImageIdResult.rows[0].image_id;
					await client.execute({
						sql: `UPDATE images SET is_main = ? WHERE image_id = ?`,
						args: [false, currentMainImageId],
					});
				}
			}

			const imageId = crypto.randomUUID().toString();
			await client.execute({
				sql: `INSERT INTO images (image_id, key, is_main)
					  VALUES (?, ?, ?)`,
				args: [imageId, key, isMain],
			});

			await client.execute({
				sql: `INSERT INTO project_image (project_id, image_id)
					  VALUES (?, ?)`,
				args: [projectId, imageId],
			});
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error inserting images to DB'}`,
				})
			);
		}
	}

	async listProject({ search, offset, limit, env }: ListProjectInfra.Input): Promise<ListProjectInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			let sqlQuery = `
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
			`;

			const args = [];

			if (search && search.length > 0) {
				sqlQuery += `
				WHERE
				LOWER(title) LIKE CONCAT('%', LOWER(?), '%')
				OR LOWER(description) LIKE CONCAT('%', LOWER(?), '%')
				`;
				args.push(search, search);
			}

			sqlQuery += `
			GROUP BY
				projects.project_id, projects.title, projects.description, projects.year, projects.is_top, projects.created_at, projects.updated_at
			ORDER BY
				projects.created_at ASC
			LIMIT ?
			OFFSET ?;
			`;

			args.push(limit, offset);

			const dbProjects = await client.execute({
				sql: sqlQuery,
				args: args,
			});

			return {
				projects: dbProjects.rows as unknown as ProjectDb[],
			};
		} catch (error: unknown) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error selecting all projects from db'}`,
				})
			);
		}
	}

	async deleteProject({ projectId, env }: DeleteProjectInfra.Input): Promise<DeleteProjectInfra.Output> {
		const client = buildLibsqlClient(env);

		try {
			const dbProject = await this.describeProject({ projectId, env });

			await client.execute({
				sql: `DELETE FROM project_image
				WHERE project_id = ?;`,
				args: [projectId],
			});

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
				sql: `DELETE FROM projects
				WHERE project_id = ?;`,
				args: [projectId],
			});

			return {
				project: dbProject.project,
			};
		} catch (error: unknown) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error deleting project by id from db'}`,
				})
			);
		}
	}

	async deleteImage({ imageKey, env }: DeleteImageInfra.Input): Promise<void> {
		const client = buildLibsqlClient(env);

		try {
			const { rows } = await client.execute({
				sql: `SELECT * FROM images
						WHERE key = ?;`,
				args: [imageKey],
			});

			const image = rows[0] as unknown as ImageDb;

			await client.execute({
				sql: `DELETE FROM project_image
						WHERE image_id = ?;`,
				args: [image.image_id],
			});

			await client.execute({
				sql: `DELETE FROM images
						WHERE image_id = ?;`,
				args: [image.image_id],
			});
		} catch (error: unknown) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error deleting image from db'}`,
				})
			);
		}
	}
}
