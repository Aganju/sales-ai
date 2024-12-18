import { describe, expect, it, vi } from 'vitest';
import { ClaudeService } from '@/lib/services/ai/claude-service';
import { AIServiceConfig } from '@/lib/services/ai/types';
import { SalesTone } from '@/types/types';

vi.mock('@anthropic-ai/sdk', () => {
  const MockAnthropic = vi.fn(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        type: 'message',
        content: [{ text: 'Generated sales message' }]
      })
    }
  }));

  return {
    default: MockAnthropic,
    Anthropic: MockAnthropic
  };
});

describe('ClaudeService', () => {
  const config: AIServiceConfig = {
    apiKey: 'test-key',
    modelName: 'test-model',
    rateLimitPerMinute: 60
  };

  it('should generate a sales message successfully', async () => {
    const service = new ClaudeService(config);
    const summary = 'Test prospect summary';
    const tone: SalesTone = 'professional';

    const result = await service.generateSalesMessage(summary, tone);
    expect(result).toBe('Generated sales message');
  });

  it('should handle API errors gracefully', async () => {
    const service = new ClaudeService(config);
    const mockError = new Error('API Error');
    
    vi.spyOn(service['client'].messages, 'create')
      .mockRejectedValueOnce(mockError);

    await expect(service.generateSalesMessage('summary', 'professional'))
      .rejects.toThrow('API Error');
  });
}); 