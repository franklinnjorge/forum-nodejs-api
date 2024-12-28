import { FastifyInstance } from 'fastify';

async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { message: 'List of users' };
  });
}

export default usersRoutes;
