import axios from 'axios';

export class OllamaConnection {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'codeglass') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateComment(code: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: `Generate a brief, informative comment for the following code:\n\n${code}\n\nAssistant: Here's a concise comment for the provided code:\n`,
        max_tokens: 150
      });

      return response.data.response;
    } catch (error) {
      console.error('Error generating comment:', error);
      return 'Unable to generate comment.';
    }
  }
}
