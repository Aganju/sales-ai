import { describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/messages/route';
import { messageQueue } from '@/lib/message-worker';
import { NextResponse } from 'next/server';

vi.mock('@/lib/message-worker', () => ({
  messageQueue: {
    add: vi.fn()
  }
}));

describe('Messages API', () => {
  it('should create a new message job', async () => {
    const mockJobId = '123';
    vi.mocked(messageQueue.add).mockResolvedValueOnce({ id: mockJobId });

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        summary: 'Test summary',
        tone: 'professional' as const
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.jobId).toBe(mockJobId);
    expect(messageQueue.add).toHaveBeenCalledWith('generate', {
      summary: 'Test summary',
      tone: 'professional'
    });
  });

  it('should handle errors', async () => {
    vi.mocked(messageQueue.add).mockRejectedValueOnce(new Error('Queue error'));

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        summary: 'Test summary',
        tone: 'professional' as const
      })
    });

    const response = await POST(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Failed to process request');
  });
}); 