import axios from 'axios';
import * as vscode from 'vscode';
import { AiConnectionInterface } from './aiConnectionInterface';

export class DeepseekConnection implements AiConnectionInterface {
    private apiKey: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('codeglass');
        this.apiKey = process.env.CODEGLASS_API_KEY as string || config.get('apiKey') as string;
    }

    async generateCommentStream(
        code: string,
        prompt: string,
        onChunk: (chunk: string) => void,
        onProgress: (progress: number) => void,
        token: vscode.CancellationToken
    ): Promise<void> {
        try {
            const response = await axios.post(`https://api.deepseek.com/chat/completions`, {
                model: "deepseek-coder",
                messages: [{role:"user", content: prompt}],
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
                    const lines = chunkStr.split('\n').filter(line => line.trim() !== '');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.slice(6);
                            if (jsonStr === '[DONE]') {
                                resolve();
                                return;
                            }
                            try {
                                const parsedData = JSON.parse(jsonStr);
                                if (parsedData.choices && parsedData.choices.length > 0) {
                                    const content = parsedData.choices[0].delta.content;
                                    if (content) {
                                        onChunk(content);
                                        onProgress(content.length);
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing SSE chunk:', e);
                            }
                        }
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