import axios from 'axios';
import * as vscode from 'vscode';
import { AiConnectionInterface } from './aiConnectionInterface';

export class OllamaConnection implements AiConnectionInterface {
    private baseUrl: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('codeglass');
        this.baseUrl = process.env.CODEGLASS_BASE_URL_KEY as string || 'http://localhost:11434';
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
                model: "codeglass:latest",
                prompt: prompt,
                stream: true
            }, {
                responseType: 'stream'
            });

            return new Promise<void>((resolve, reject) => {
                response.data.on('data', (chunk: Buffer) => {
                    const chunkStr = chunk.toString();
                    try {
                        const parsedChunk = JSON.parse(chunkStr);
                        if (parsedChunk.response) {
                            onChunk(parsedChunk.response);
                            onProgress(parsedChunk.response.length);
                        }
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                });

                response.data.on('end', () => {
                    resolve();
                });

                response.data.on('error', (error: Error) => {
                    reject(error);
                });

                token.onCancellationRequested(() => {
                    response.data.destroy();
                    reject(new Error('Operation cancelled'));
                });
            });
        } catch (error) {
            console.error('Error in generateCommentStream:', error);
            throw error;
        }
    }
}