// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { exec } from "child_process";

function checkElaraInstalled(): Promise<boolean> {
	return new Promise((resolve) => {
		exec('elara --help', (error, stdout, stderr) => {
			console.log(`check installed: ${error}, ${stdout}, ${stderr}`);
			if (error || stderr) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "elara" is now active!');

	const config = vscode.workspace.getConfiguration('elara');
	const elaraTheme = config.get<string>('theme');
	const elaraFont = config.get<string>('font');
	const elaraCodeFont = config.get<string>('codeFont');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('elara.convertNotebookToHTML', async () => {
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

		const isInstalled = await checkElaraInstalled();
		if (!isInstalled) {
			vscode.window.showErrorMessage('Elara is not installed or not found in the PATH.');
			return;
		}

		vscode.window.showInformationMessage("Converting Jupyter Notebook to HTML...");

		const themeArg = elaraTheme ? `--theme "${elaraTheme}"` : '';
		const fontArg = elaraFont ? `--font "${elaraFont}"` : '';
		const codeFontArg = elaraCodeFont ? `--code-font "${elaraCodeFont}"` : '';
		const convertCommand = `elara convert --silent ${filePath} ${themeArg} ${fontArg} ${codeFontArg}`;
		console.log(`Executing command: ${convertCommand}`);

		exec(convertCommand, async (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Conversion failed: ${error.message}`);
				return;
			}
			if (stderr) {
				vscode.window.showErrorMessage(`Conversion failed: ${stderr}`);
				return;
			}

			const htmlFilePath = stdout.trim();
			const openButton = 'Open';
			const result = await vscode.window.showInformationMessage(
				`Conversion successful! HTML file created at: ${htmlFilePath}`,
				openButton
			);

			if (result === openButton) {
				const uri = vscode.Uri.file(htmlFilePath);
				await vscode.env.openExternal(uri);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
