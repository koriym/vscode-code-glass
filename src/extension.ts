import * as vscode from 'vscode';
import * as path from 'path';
import { OllamaConnection } from './ollamaConnection';
import { DeepseekConnection } from './deepseekConnection';
import { AiConnectionInterface } from './aiConnectionInterface';

async function updateConfiguration() {
    let aiConnection = new OllamaConnection();
    const models = await aiConnection.loadModelList();
    const configuration = vscode.workspace.getConfiguration('codeglass');
    configuration.update('model', {
      type: 'string',
      enum: models,
      default: models[0],
      description: 'Select model to use for code commenting'
    }, vscode.ConfigurationTarget.Global);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeGlass is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('codeglass.updateModels', async () => {
            await updateConfiguration();
            vscode.window.showInformationMessage('Model configuration updated');
        })
    );

    let disposable = vscode.commands.registerCommand('codeglass.addComments', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const code = document.getText();
        // const prompt = `Please fix the errors in the code below:\n\n\`\`\`\n${code}`;

        const config = vscode.workspace.getConfiguration('codeglass');
        const connectionType = config.get('connectionType') as string;
        const prompt = config.get('prompt') as string;

        let aiConnection: AiConnectionInterface;
        if (connectionType === 'ollama') {
            aiConnection = new OllamaConnection();
        } else if (connectionType === 'deepseek') {
            aiConnection = new DeepseekConnection();
        } else {
            vscode.window.showErrorMessage('Invalid connection type in settings');
            return;
        }

        // Create or get the comments file
        const originalFilePath = document.fileName;
        const dirName = path.dirname(originalFilePath);
        const baseName = path.basename(originalFilePath, path.extname(originalFilePath));
        const newFilePath = path.join(dirName, `${baseName}_comments${path.extname(originalFilePath)}`);
        const newUri = vscode.Uri.file(newFilePath);
        
        // Clear the file content or create a new empty file
        await vscode.workspace.fs.writeFile(newUri, Buffer.from(''));
        
        // Open both files side by side
        const newDocument = await vscode.workspace.openTextDocument(newUri);
        const newEditor = await vscode.window.showTextDocument(newDocument, vscode.ViewColumn.Beside);

        // Ensure the new file is empty
        await newEditor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                newDocument.positionAt(0),
                newDocument.positionAt(newDocument.getText().length)
            );
            editBuilder.delete(fullRange);
        });

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "CodeGlass: Generating comments...",
            cancellable: true
        }, async (progress, token) => {
            try {
                let totalChars = 0;
                let buffer = '';
                let lines: string[] = [];

                const flushBuffer = async () => {
                    if (buffer) {
                        await newEditor.edit(editBuilder => {
                            const position = new vscode.Position(newDocument.lineCount, 0);
                            editBuilder.insert(position, buffer);
                        });
                        buffer = '';
                    }
                };

                await aiConnection.generateCommentStream(
                    code,
                    prompt,
                    async (content: string) => {
                        buffer += content;
                        if (buffer.includes('\n')) {
                            await flushBuffer();
                        }
                    },
                    (progressValue: number) => {
                        totalChars += progressValue;
                        progress.report({ increment: progressValue, message: `Generated ${totalChars} characters` });
                    },
                    token
                );

                // Flush any remaining content
                await flushBuffer();

                vscode.window.showInformationMessage('Comments generation completed.');
            } catch (error) {
                console.error('Error in generateCommentStream:', error);
                let errorMessage = 'An error occurred while generating comments.';
                if (error instanceof Error) {
                    errorMessage += ' ' + error.message;
                } else if (typeof error === 'string') {
                    errorMessage += ' ' + error;
                }
                vscode.window.showErrorMessage(errorMessage);
            }
        });
    });

    context.subscriptions.push(disposable);
    // Call updateConfiguration on extension activation
    updateConfiguration();
}

export function deactivate() {}
