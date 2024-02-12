import { Router, RouterType } from 'itty-router';
import corsMiddleware from '../middlewares/cors';
import { Env } from '..';
import { describeProjectHandler } from '../api/project/handlers/project_describe_handler';
import { createProjectHandler } from '../api/project/handlers/project_create_handler';
import { listProjectsHandler } from '../api/project/handlers/project_list_handler';
import { deleteProjectHandler } from '../api/project/handlers/project_delete_handler';
import { userLoginHandler } from '../api/user/handlers/login_user_handler';
import { updateUserHandler } from '../api/user/handlers/update_user.handler';
import { uploadUserHandler } from '../api/user/handlers/create_user.handler';
import { describeUserHandler } from '../api/user/handlers/describe_user_handler';
import { updatePasswordUserHandler } from '../api/user/handlers/update_password.handler';

function buildRouter(env: Env): RouterType {
	const router = Router();

	// Project handlers
	router.get('/project/list', corsMiddleware(listProjectsHandler));
	router.get('/project/describe/:id', corsMiddleware(describeProjectHandler));
	router.post('/project/create', corsMiddleware(createProjectHandler));
	router.delete('/project/delete/:id', corsMiddleware(deleteProjectHandler));

	// User handlers
	router.get('/user/describe', corsMiddleware(describeUserHandler));
	router.post('/user/create', corsMiddleware(uploadUserHandler));
	router.post('/user/login', corsMiddleware(userLoginHandler));
	router.put('/user/update', corsMiddleware(updateUserHandler));
	router.put('/user/update/password', corsMiddleware(updatePasswordUserHandler));

	router.all('*', () => new Response('Request not found', { status: 404 }));

	return router;
}

export default buildRouter;
