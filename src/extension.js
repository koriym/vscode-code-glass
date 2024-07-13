"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ollamaConnection_1 = require("./ollamaConnection");
const prompts_1 = require("./prompts");
function activate(context) {
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
        const baseUrl = config.get('baseUrl');
        const model = config.get('model');
        const apiKey = process.env.CODEGLASS_API_KEY;
        // console.log(`Configuration - baseUrl: ${baseUrl}, model: ${model}, apiKey: !${baseUrl.includes('localhost') ? (apiKey ? '********' : 'not set') : 'not required'}`);
        if (!baseUrl || !model || !baseUrl.includes('localhost') && !apiKey) {
            vscode.window.showErrorMessage('CodeGlass設定が正しくありません。baseUrl、model、および必要に応じてAPIキーを設定してください。');
            return;
        }
        const promptTemplate = prompts_1.defaultPrompt;
        const fullPrompt = promptTemplate
            .replace('{fileName}', path.basename(fileName))
            .replace('{code}', code);
        const ollamaConnection = new ollamaConnection_1.OllamaConnection(baseUrl, model, apiKey);
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
                const streamHandler = (chunk) => {
                    console.log(`Received chunk: ${chunk}`);
                    try {
                        const parsedChunk = JSON.parse(chunk);
                        if (parsedChunk.done) {
                            console.log('Stream completed');
                            return;
                        }
                        else if (parsedChunk.response) {
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
                    }
                    catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                };
                const progressHandler = (processedChars) => {
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
            }
            catch (error) {
                console.error('CodeGlass拡張機能でエラーが発生しました:', error);
                vscode.window.showErrorMessage('コメントの生成中にエラーが発生しました。詳細はコンソールをご確認ください。');
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map