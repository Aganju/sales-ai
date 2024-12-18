// Import required dependencies for message queue and Redis operations
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { AIServiceConfig } from './services/ai/types';
import { ClaudeService } from './services/ai/claude-service';

// Initialize Redis connection with fallback to localhost
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Create message queue for processing sales message generation requests
export const messageQueue = new Queue('messages', { 
  connection,
  defaultJobOptions: {
    attempts: parseInt(process.env.MESSAGE_WORKER_RETRIES || '3', 10)
  }
});

// Worker to process message generation jobs
const worker = new Worker('messages', async (job) => {
  try {
    const config: AIServiceConfig = {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      modelName: 'claude-3-5-sonnet-20240620',
      rateLimitPerMinute: 60
    };

    // Generate sales message using AI service
    const aiService = new ClaudeService(config);
    const message = await aiService.generateSalesMessage(job.data.summary, job.data.tone);

    // Store generated message in connection
    await connection.set(`sales_message:${job.id}`, message);

    return { message: `Generated message for ${job.data.summary}` };
  } catch (error: unknown) {
    throw new Error(`Message generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err}`));