import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import usersRoutes from './routes/users';
import { swaggerConfig } from './plugins/swagger';

const app = Fastify();

app.register(swagger, swaggerConfig);
app.register(usersRoutes, { prefix: '/users' });

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Server running at http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
