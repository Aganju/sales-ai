import { messageQueue } from '@/lib/message-worker';
import { NextResponse } from 'next/server';
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const job = await messageQueue.getJob(await params.jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return NextResponse.json({ 
      id: job.id,
      state,
      result
    });
  } catch (error) {
    console.error('Error fetching job status:', error);

    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}