import { Router, RouterType } from 'itty-router';
import corsMiddleware from '../middlewares/cors';
import { listProjectHandler } from '../api/project/project_list';
import { describeProjectHandler } from '../api/project/project_describe';
import { uploadProjectHandler } from '../api/project/upload/project_upload_handler';
import { Env } from '..';
import { listProjectsHandler } from '../api/project/list/project_list_handler';

function buildRouter(env: Env): RouterType {
	const router = Router();

	// Project handlers
	router.post('/project/upload', corsMiddleware(uploadProjectHandler));
	router.get('/project/list', corsMiddleware(listProjectsHandler));
	router.get('/project/describe/:id', corsMiddleware(describeProjectHandler));

	// router.get('/add-user', async (request) => {
	// 	const client = buildLibsqlClient(env);
	// 	const email = request.query.email;
	// 	if (email === undefined) {
	// 		return new Response('Missing email', { status: 400 });
	// 	}
	// 	if (typeof email !== 'string') {
	// 		return new Response('email must be a single string', { status: 400 });
	// 	}
	// 	if (email.length === 0) {
	// 		return new Response('email length must be > 0', { status: 400 });
	// 	}

	// 	try {
	// 		await client.execute({
	// 			sql: 'insert into example_users values (?)',
	// 			args: [email],
	// 		});
	// 	} catch (e) {
	// 		console.error(e);
	// 		return new Response('database insert failed');
	// 	}

	// 	return new Response('Added');
	// });

	router.all('*', () => new Response(`${env.LIBSQL_DB_URL}`, { status: 404 }));

	return router;
}

export default buildRouter;
