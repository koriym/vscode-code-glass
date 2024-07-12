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

  async generateComment(code: string, prompt: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<string> {
    try {
      console.log('Adding comments to code:', code.substring(0, 100) + '...');
      progress.report({ message: 'Analyzing code and adding comments...' });
  
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false
      }, { 
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log('Response received from Ollama');
      progress.report({ message: 'Processing AI response...' });
  
      return response.data.response || 'Unable to add comments.';
    } catch (error) {
      console.error('Error adding comments:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      throw error;
    }
  }
}
