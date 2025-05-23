// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { exec } from "child_process";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "elara" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('elara.convertNotebookToHTML', () => {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}
		const filePath = editor.document.fileName;
		if (!filePath.endsWith('.ipynb')) {
			vscode.window.showErrorMessage('The active file is not a Jupyter Notebook (.ipynb).');
			return;
		}
		// Display a message box to the user
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Converting Jupyter Notebook to HTML...",
			cancellable: false
		}, async (progress) => {
			return new Promise<void>((resolve, reject) => {
				exec(`elara convert --silent ${filePath}`, (error, stdout, stderr) => {
					if (error) {
						progress.report({ message: `Conversion failed: ${error.message}` });
						setTimeout(() => resolve(), 2000);
						return;
					}
					if (stderr) {
						progress.report({ message: `Conversion failed: ${stderr}` });
						setTimeout(() => resolve(), 2000);
						return;
					}
					progress.report({ message: `Conversion successful! Opening file...` });
					setTimeout(async () => {
						const htmlFilePath = stdout.trim();
						const uri = vscode.Uri.file(htmlFilePath);
						await vscode.env.openExternal(uri);
						resolve();
					}, 1000);
				});
			});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
