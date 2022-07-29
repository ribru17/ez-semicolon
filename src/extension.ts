// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "smart-semicolons" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('smart-semicolons.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from smart-semicolons!');
	// });

	// context.subscriptions.push(disposable);

	const editor = vscode.window.activeTextEditor;

	if (!editor) { return; }

	vscode.workspace.onDidChangeTextDocument(e => {
		if (e.contentChanges[e.contentChanges.length - 1].text === ';' || e.contentChanges[0].text === ';') {
			if (editor && editor.selection.isEmpty) {
				semicolonAtEnd();
			}
		}
	}, null, context.subscriptions);
}

function semicolonAtEnd() {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return;
	}

	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);
	let lineLength = lineObject.text.length;
	let cursorPos = editor.selection.active.character;

	if (lineObject.text.indexOf('for') !== -1) { return; }

	// two adjacent semicolons at end of line
	if ((lineObject.text.charAt(cursorPos - 1) === ';' && cursorPos === lineLength - 1) || (lineObject.text.charAt(cursorPos + 1) === ';' && cursorPos === lineLength - 2)) {
		vscode.commands.executeCommand('deleteLeft').then(() => {
			vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
				// console.log('valid line after');
			}).then(undefined, err => {
				console.error(err);
			});
		}).then(undefined, err => {
			console.error(err);
		});
	}
	else if (lineObject.text.charAt(lineLength - 1) !== ';') { // no semicolon at end of line
		vscode.commands.executeCommand('deleteLeft').then(() => {
			if (!editor) { return; }

			vscode.commands.executeCommand('cursorEnd').then(success => {
				// console.log('valid cursor end');
			}).then(undefined, err => {
				console.error(err);
			});
			
			vscode.commands.executeCommand("type", { text: ';' }).then(success => {
				// console.log('valid type');
			}).then(undefined, err => {
				console.error(err);
			});
		}).then(undefined, err => {
			console.error(err);
		});
	} else { // semicolon already at end of line
		if (cursorPos !== lineLength - 1) {
			vscode.commands.executeCommand('deleteLeft').then(success => {
				// console.log('valid delete left');
			}).then(undefined, err => {
				console.error(err);
			});
			// return;
		}
		vscode.commands.executeCommand('editor.action.insertLineAfter').then(success => {
			// console.log('valid line after');
		}, err => {
			console.error(err);
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
