import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { OllamaConnection } from './OllamaConnection';
import { defaultPrompt } from './prompts';

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeGlass is now active!');

    let disposable = vscode.commands.registerCommand('codeglass.addComments', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const code = document.getText();
        const fileName = document.fileName;
        const fileExtension = path.extname(fileName);

        const config = vscode.workspace.getConfiguration('codeglass');
        const baseUrl = config.get('baseUrl') as string || 'http://localhost:11434';
        const model = config.get('model') as string || 'codeglass';
        const promptTemplate = defaultPrompt;
        const fullPrompt = promptTemplate
            .replace('{fileName}', path.basename(fileName))
            .replace('{code}', code);

        const ollamaConnection = new OllamaConnection(baseUrl, model);

        // 一時ファイルのパスを生成
        const tempDir = path.join(context.extensionPath, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const tempFilePath = path.join(tempDir, `${path.basename(fileName, fileExtension)}_commented${fileExtension}`);

        let tempDocument = await vscode.workspace.openTextDocument({ language: document.languageId, content: '' });
        await vscode.window.showTextDocument(tempDocument, vscode.ViewColumn.Beside);
        const tempEditor = vscode.window.visibleTextEditors.find(editor => editor.document.uri === tempDocument.uri);

        if (!tempEditor) {
            vscode.window.showErrorMessage('テンポラリドキュメントの作成に失敗しました。');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "CodeGlass",
            cancellable: true
        }, async (progress, token) => {
            try {
                let buffer = '';

                const streamHandler = (chunk: string) => {
                    console.log(`Received chunk: ${chunk}`);
                    try {
                        const parsedChunk = JSON.parse(chunk);
                        if (parsedChunk.done) {
                            console.log('Stream completed');
                            return;
                        } else if (parsedChunk.response) {
                            buffer += parsedChunk.response;
                            if (buffer.endsWith('\n') || buffer.length > 1000) {
                                const lastLine = tempDocument.lineCount - 1;
                                const lastLineText = tempDocument.lineAt(lastLine).text;
                                const range = new vscode.Range(new vscode.Position(lastLine, 0), new vscode.Position(lastLine, lastLineText.length));

                                tempEditor.edit(editBuilder => {
                                    editBuilder.replace(range, lastLineText + buffer);
                                });
                                buffer = '';
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                };

                const progressHandler = (processedChars: number) => {
                    progress.report({
                        message: `Generating comments... (${processedChars} characters)`,
                        increment: 1
                    });
                };

                await ollamaConnection.generateCommentStream(code, fullPrompt, streamHandler, progressHandler, token);

                // 最後にバッファに残っている内容を追加
                if (buffer.length > 0) {
                    const lastLine = tempDocument.lineCount - 1;
                    const lastLineText = tempDocument.lineAt(lastLine).text;
                    const range = new vscode.Range(new vscode.Position(lastLine, 0), new vscode.Position(lastLine, lastLineText.length));

                    tempEditor.edit(editBuilder => {
                        editBuilder.replace(range, lastLineText + buffer);
                    });
                }

                vscode.window.showInformationMessage(`コメント付きコードが生成されました`);
            } catch (error) {
                console.error('CodeGlass拡張機能でエラーが発生しました:', error);
                vscode.window.showErrorMessage('コメントの生成中にエラーが発生しました。詳細はコンソールをご確認ください。');
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
