import { AIService, AIServiceConfig } from '@/lib/services/ai/types';
import { SalesTone } from '@/types/types';
import { RateLimiter } from './rate-limiter';

/**
 * Service for generating sales messages using ChatGPT API
 * with rate limiting and tone customization
 */
export class ChatGPTService implements AIService {
  private apiKey: string;
  private modelName: string;
  private rateLimiter: RateLimiter;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.modelName = config.modelName || 'gpt-4-turbo-preview';
    this.rateLimiter = new RateLimiter(config.rateLimitPerMinute || 60);
  }

  private getTonePrompt(tone: SalesTone): string {
    const tonePrompts = {
      professional: 'Write in a formal, business-focused tone that emphasizes professionalism and expertise.',
      consultative: 'Write in an empathetic, solution-oriented tone that focuses on understanding and solving the prospect\'s challenges.',
      dynamic: 'Write in a high-energy, results-focused tone that emphasizes action and outcomes.',
      friendly: 'Write in a warm, approachable tone while maintaining professional credibility.'
    };
    return tonePrompts[tone];
  }

  private createPrompt(summary: string, tone: SalesTone): string {
    return `
    You are a skilled sales professional writing a personalized message to a prospect. 
    
    Prospect Summary:
    ${summary}
    
    Tone Instructions: ${this.getTonePrompt(tone)}
    
    Guidelines:
    - Keep the message concise (2-3 paragraphs)
    - Focus on the prospect's specific needs and challenges
    - Include a clear value proposition
    - End with a soft call to action
    
    Write the sales message:`;
  }

  /**
   * Generates a sales message using ChatGPT API
   * @throws Error if API request fails or rate limit exceeded
   */
  async generateSalesMessage(
    summary: string,
    tone: SalesTone
  ): Promise<string> {
    try {
      await this.rateLimiter.checkRateLimit();

      const prompt = await this.createPrompt(summary, tone);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 1000,
          temperature: 0.7  // Controls creativity level (0-1)
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      //To handle service specific errors
      throw error;
    }
  }
}