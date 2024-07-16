import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';

export class AiConnection {
    constructor(private baseUrl: string, private model: string, private apiKey: string) {}

    async generateCommentStream(
        code: string,
        prompt: string,
        onChunk: (chunk: string) => void,
        onProgress: (progress: number) => void,
        token: vscode.CancellationToken
    ): Promise<void> {
        try {
            const response = await axios.post(`http://127.0.0.1:11434/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: true
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                responseType: 'stream'
            });

            return new Promise<void>((resolve, reject) => {
                response.data.on('data', (chunk: Buffer) => {
                    const chunkStr = chunk.toString();
                    onChunk(chunkStr);
                    onProgress(chunkStr.length);
                });

                response.data.on('end', () => {
                    resolve();
                });

                response.data.on('error', (error: Error) => {
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Error in generateCommentStream:', error);
            throw error;
        }
    }
}
