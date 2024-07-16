import * as vscode from 'vscode';

export interface AiConnectionInterface {
    generateCommentStream(
        code: string,
        prompt: string,
        onChunk: (chunk: string) => void,
        onProgress: (progress: number) => void,
        token: vscode.CancellationToken
    ): Promise<void>;
}
