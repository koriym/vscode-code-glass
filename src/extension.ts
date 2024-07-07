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

            try {
                const aiComment = await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "CodeGlass: Generating AI comment",
                    cancellable: true
                }, async (progress, token) => {
                    token.onCancellationRequested(() => {
                        console.log("User canceled the long running operation");
                    });

                    progress.report({ message: "Analyzing code..." });
                    return await ollamaConnection.generateComment(content, progress);
                });

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
                vscode.window.showErrorMessage(`An error occurred in CodeGlass: ${getErrorMessage(error)}. Check the debug console for more details.`);
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
            body {
                font-family: Arial, sans-serif;
                background-color: #1e1e1e;
                color: #d4d4d4;
                padding: 20px;
            }
            h1 {
                color: #ffffff;
            }
            pre {
                background-color: #2d2d2d;
                color: #d4d4d4;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
            }
            .ai-comment {
                background-color: #264f78;
                color: #ffffff;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .ai-comment h3 {
                margin-top: 0;
            }
        </style>
    </head>
    <body>
        <h1>CodeGlass Preview</h1>
        <div class="ai-comment">
            <h3>AI Comment:</h3>
            <p>${aiComment || 'Unable to generate comment.'}</p>
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
