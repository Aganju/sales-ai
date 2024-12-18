import { SalesTone } from '@/types/types';

export interface AIServiceConfig {
  apiKey: string;
  modelName?: string;
  rateLimitPerMinute?: number;
}

export interface AIService {
  generateSalesMessage(
    summary: string,
    tone: SalesTone,
  ): Promise<string>;
}