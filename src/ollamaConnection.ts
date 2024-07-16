import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';

export class AiConnection {
    private baseUrl: string;
    private model: string;
    private apiKey: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('codeglass');
        this.baseUrl = process.env.CODEGLASS_BASE_URL_KEY as string || 'http://localhost:11434' as string;
        this.model = process.env.CODEGLASS_MODEL_KEY as string || 'codeglass:latest' as string;
        this.apiKey = process.env.CODEGLASS_API_KEY as string || '';
    }

    async generateCommentStream(
        code: string,
        prompt: string,
        onChunk: (chunk: string) => void,
        onProgress: (progress: number) => void,
        token: vscode.CancellationToken
    ): Promise<void> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
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
