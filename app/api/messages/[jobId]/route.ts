import IORedis from 'ioredis';
import { messageQueue } from '@/lib/message-worker';
import { NextResponse } from 'next/server';

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = await params;
    const job = await messageQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const state = await job.getState();
    
    if (state !== 'completed') {
      return NextResponse.json({ 
        id: job.id,
        state
      });
    }

    // Fetch message from Redis
    const message = await redis.get(`sales_message:${job.id}`);

    if (!message) {
      return NextResponse.json(
        { error: 'Message expired or not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      id: job.id,
      state,
      message
    });
  } catch (error) {
    console.error('Error fetching job status:', error);

    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}