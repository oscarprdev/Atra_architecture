import { Router, RouterType } from 'itty-router';
import corsMiddleware from '../middlewares/cors';
import { uploadProjectHandler } from '../api/project/upload/project_upload_handler';
import { Env } from '..';
import { listProjectsHandler } from '../api/project/list/project_list_handler';
import { describeProjectHandler } from '../api/project/describe/project_describe_handler';
import { deleteProjectHandler } from '../api/project/delete/project_delete_handler';
import { uploadUserHandler } from '../api/user/upload/user_upload_handler';
import { describeUserHandler } from '../api/user/describe/user_describe_handler';

function buildRouter(env: Env): RouterType {
	const router = Router();

	// Project handlers
	router.get('/project/list', corsMiddleware(listProjectsHandler));
	router.get('/project/describe/:id', corsMiddleware(describeProjectHandler));
	router.post('/project/upload', corsMiddleware(uploadProjectHandler));
	router.delete('/project/delete/:id', corsMiddleware(deleteProjectHandler));

	// User handlers
	router.get('/user/describe/:id', corsMiddleware(describeUserHandler));
	router.post('/user/upload', corsMiddleware(uploadUserHandler));

	router.all('*', () => new Response('Request not found', { status: 404 }));

	return router;
}

export default buildRouter;
