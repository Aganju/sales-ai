import { messageQueue } from '@/lib/message-worker';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const job = await messageQueue.add('generate', body);
    
    return NextResponse.json({ jobId: job.id });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
