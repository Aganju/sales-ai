export class RateLimiter {
  private requestTimes: number[] = [];
  private requestsPerMinute: number;

  constructor(requestsPerMinute: number) {
    this.requestsPerMinute = requestsPerMinute;
  }

  async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove requests older than 1 minute
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);

    if (this.requestTimes.length >= this.requestsPerMinute) {
      const oldestRequest = this.requestTimes[0];
      const timeToWait = 60000 - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    this.requestTimes.push(now);
  }
}