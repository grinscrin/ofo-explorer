import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { folderController } from './controllers/folder.controller';
import { fileController } from './controllers/file.controller';
import { prisma } from './config/prisma';
import { swagger } from '@elysiajs/swagger';

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(swagger()) 
  .use(cors())
  .use(folderController)
  .use(fileController)
  .get('/', () => 'OFO Explorer API')
  .listen(PORT);

console.log(`🦊 Server running at ${app.server?.hostname}:${app.server?.port}`);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});