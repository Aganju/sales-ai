import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { RateLimiter } from '@/lib/services/ai/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests within rate limit', async () => {
    const limiter = new RateLimiter(3); // 3 requests per minute
    
    await limiter.checkRateLimit();
    await limiter.checkRateLimit();
    
    await expect(limiter.checkRateLimit()).resolves.not.toThrow();
  });

  it('should delay requests that exceed rate limit', async () => {
    const limiter = new RateLimiter(1); // 1 request per minute
    
    await limiter.checkRateLimit();
    
    const start = Date.now();
    const checkLimitPromise = limiter.checkRateLimit();
    
    // Fast-forward time
    await vi.advanceTimersByTimeAsync(60000);
    
    await checkLimitPromise;
    const end = Date.now();
    
    expect(end - start).toBeGreaterThanOrEqual(60000);
  });
}); 