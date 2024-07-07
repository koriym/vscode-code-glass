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
                const commentedCode = await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "CodeGlass: Generating comments",
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

                panel.webview.html = getWebviewContent(commentedCode);
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

function getWebviewContent(commentedCode: string) {
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
            }
            pre { 
                background-color: #2d2d2d; 
                padding: 10px; 
                border-radius: 5px;
                overflow-x: auto;
            }
            code {
                font-family: 'Consolas', 'Courier New', monospace;
            }
            .commented-code { 
                margin-top: 20px; 
            }
            h1, h2 { 
                color: #ffffff; 
            }
        </style>
    </head>
    <body>
        <h1>CodeGlass Preview</h1>
        <div class="commented-code">
            <h2>Commented Code</h2>
            <pre><code>${escapeHtml(commentedCode)}</code></pre>
        </div>
    </body>
    </html>`;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export function deactivate() {}