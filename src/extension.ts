import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { OllamaConnection } from './OllamaConnection'; // OllamaConnectionをインポート
import { defaultPrompt } from './prompts'; // デフォルトプロンプトをインポート

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeGlass is now active!');

    // コメントを追加するコマンド
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

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "CodeGlass",
            cancellable: false
        }, async (progress) => {
            try {
                const commentedCode = await ollamaConnection.generateComment(code, fullPrompt, progress);

                // 新しいファイル名を生成
                const directory = path.dirname(fileName);
                const baseName = path.basename(fileName, fileExtension);
                const newFileName = path.join(directory, `${baseName}_commented${fileExtension}`);

                // コメント付きコードを新しいファイルに保存
                fs.writeFileSync(newFileName, commentedCode);

                // 新しいファイルを開く
                const openPath = vscode.Uri.file(newFileName);
                const doc = await vscode.workspace.openTextDocument(openPath);

                // 現在のファイルを現在のビューに表示
                await vscode.window.showTextDocument(document, editor.viewColumn);

                // 新しいファイルを隣のビュー列に表示
                await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

                vscode.window.showInformationMessage(`コメント付きコードが ${newFileName} に保存されました`);
            } catch (error) {
                console.error('CodeGlass拡張機能でエラーが発生しました:', error);
                vscode.window.showErrorMessage('コメントの生成中にエラーが発生しました。詳細はコンソールをご確認ください。');
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
