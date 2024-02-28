import { Router, RouterType } from 'itty-router';
import { corsHeaders, corsMiddleware } from '../middlewares/cors';
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
import { updateProjectHandler } from '../api/project/handlers/project_update_handler';
import { validateAuthHandler } from '../api/user/handlers/validate_auth.handler';
import { authMiddleware } from '../middlewares/auth';
import { updateProjectIsTopHandler } from '../api/project/handlers/project_update_is_top_handler';

function buildRouter(env: Env): RouterType {
	const router = Router();

	// Project handlers
	router.get('/project/list', corsMiddleware(listProjectsHandler));
	router.get('/project/describe/:id', corsMiddleware(describeProjectHandler));
	router.post('/project/create', corsMiddleware(authMiddleware(createProjectHandler)));
	router.delete('/project/delete/:id', corsMiddleware(authMiddleware(deleteProjectHandler)));
	router.put('/project/update', corsMiddleware(authMiddleware(updateProjectHandler)));
	router.put('/project/update/isTop', corsMiddleware(authMiddleware(updateProjectIsTopHandler)));

	// User handlers
	router.get('/user/describe', corsMiddleware(describeUserHandler));
	router.post('/user/create', corsMiddleware(uploadUserHandler));
	router.put('/user/update', corsMiddleware(authMiddleware(updateUserHandler)));
	router.put('/user/update/password', corsMiddleware(authMiddleware(updatePasswordUserHandler)));

	// Auth handler
	router.post('/auth/login', corsMiddleware(userLoginHandler));
	router.post('/auth/validate', corsMiddleware(validateAuthHandler));

	router.all('*', (request) => {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		new Response('Request not found', { status: 404 });
	});

	return router;
}

export default buildRouter;
