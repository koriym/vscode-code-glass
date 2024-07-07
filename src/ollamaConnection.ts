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
  
      console.log('Sending request to Ollama server...');
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: code,
        stream: false
      }, { 
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log('Response received from Ollama:', response.data);
      progress.report({ message: 'Processing AI response...' });
  
      return response.data.response || 'Unable to generate comment.';
    } catch (error) {
      console.error('Error generating comment:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        console.error('Axios error status:', error.response?.status);
        console.error('Axios error headers:', error.response?.headers);
      }
      throw error;
    }
  }
}