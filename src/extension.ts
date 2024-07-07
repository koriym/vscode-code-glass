import * as vscode from 'vscode';
import { OllamaConnection } from './ollamaConnection';

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeGlass is now active!');

    const ollamaConnection = new OllamaConnection();

    let disposable = vscode.commands.registerCommand('codeglass.showPreview', async () => {
        console.log('CodeGlass: Show Code Preview command triggered');
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const content = document.getText();

            vscode.window.showInformationMessage('Generating AI comment...');

            try {
                const aiComment = await ollamaConnection.generateComment(content);
                
                const panel = vscode.window.createWebviewPanel(
                    'codeGlassPreview',
                    'CodeGlass Preview',
                    vscode.ViewColumn.Beside,
                    {}
                );

                panel.webview.html = getWebviewContent(content, aiComment);
                console.log('Webview panel created and content set');
            } catch (error) {
                console.error('Error in CodeGlass extension:', error);
                vscode.window.showErrorMessage('An error occurred in CodeGlass: ' + getErrorMessage(error));
            }
        } else {
            vscode.window.showInformationMessage('No active editor found');
        }
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(sourceCode: string, aiComment: string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeGlass Preview</title>
        <style>
            body { font-family: Arial, sans-serif; }
            pre { background-color: #f4f4f4; padding: 10px; }
            .ai-comment { background-color: #e6f3ff; padding: 10px; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <h1>CodeGlass Preview</h1>
        <div class="ai-comment">
            <h3>AI Comment:</h3>
            <p>${aiComment}</p>
        </div>
        <pre><code>${escapeHtml(sourceCode)}</code></pre>
    </body>
    </html>`;
}

function escapeHtml(unsafe: string) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function deactivate() {}