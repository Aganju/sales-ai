import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HonoAdapter } from '@bull-board/hono';
import { messageQueue } from '@/lib/message-worker';
import { serveStatic } from '@hono/node-server/serve-static';

//initialize hono app
const app = new Hono();
const basePath = "/api/admin/queues";
const honoAdapter = new HonoAdapter(serveStatic);

//initialize bull board
createBullBoard({
  queues: [new BullMQAdapter(messageQueue)],
  serverAdapter: honoAdapter
});

honoAdapter.setBasePath(basePath);
app.route(basePath, honoAdapter.registerPlugin());

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
