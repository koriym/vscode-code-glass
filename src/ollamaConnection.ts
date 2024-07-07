import axios from 'axios';
import * as vscode from 'vscode';

export class OllamaConnection {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'codeglass') {
    this.baseUrl = baseUrl;
    this.model = model;
    console.log(`OllamaConnection initialized with baseUrl: ${baseUrl} and model: ${model}`);
  }

  async generateComment(code: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<string> {
    try {
      console.log('Generating comment for code:', code.substring(0, 100) + '...');
      progress.report({ message: 'Sending request to AI model...' });

      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: `Generate a brief, informative comment for the following code:\n\n${code}\n\nAssistant: Here's a concise comment for the provided code:\n`,
        max_tokens: 150
      }, { timeout: 60000 });

      console.log('Response received from Ollama:', response.data);
      progress.report({ message: 'Processing AI response...' });

      return response.data.response;
    } catch (error) {
      console.error('Error generating comment:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      throw error;
    }
  }
}
