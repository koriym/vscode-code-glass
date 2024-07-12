import * as vscode from 'vscode';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { phpPrompt } from './prompts'; // プロンプトをインポート

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
        const languageId = document.languageId;
        const fileName = document.fileName;
        const fileExtension = path.extname(fileName);

        const config = vscode.workspace.getConfiguration('codeglass');
        const baseUrl = config.get('baseUrl') as string || 'http://localhost:11434';
        const model = config.get('model') as string || 'codeglass';

        const promptTemplate = languageId === 'php' ? phpPrompt : config.get('defaultPrompt') as string;
        const fullPrompt = `${promptTemplate}\n\nFile: ${path.basename(fileName)}\n\n${code}`;

        try {
            const response = await axios.post(`${baseUrl}/api/generate`, {
                model: model,
                prompt: fullPrompt,
                stream: false
            });

            const commentedCode = response.data.response;

            // 新しいファイル名を生成
            const directory = path.dirname(fileName);
            const baseName = path.basename(fileName, fileExtension);
            const newFileName = path.join(directory, `${baseName}_commented${fileExtension}`);

            // コメント付きコードを新しいファイルに保存
            fs.writeFileSync(newFileName, commentedCode);

            // 新しいファイルを開く
            const openPath = vscode.Uri.file(newFileName);
            const doc = await vscode.workspace.openTextDocument(openPath);

            // 現在のエディターのビュー列を取得
            const activeViewColumn = editor.viewColumn;

            // コメント付きコードファイルを別のビュー列に表示
            await vscode.window.showTextDocument(doc, activeViewColumn ? activeViewColumn + 1 : vscode.ViewColumn.Beside);

            vscode.window.showInformationMessage(`Commented code saved to ${newFileName}`);

        } catch (error) {
            console.error('Error in CodeGlass extension:', error);
            vscode.window.showErrorMessage('An error occurred while generating comments. Please check the console for details.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
