import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const messageQueue = new Queue('messages', { connection });

const worker = new Worker('messages', async (job) => {
  try {
    // Placeholder for AI service integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { message: `Generated message for ${job.data.summary}` };
  } catch (error: unknown) {
    throw new Error(`Message generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err}`));