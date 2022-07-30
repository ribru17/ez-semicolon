// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ez-semicolon" is now active!');

	const editor = vscode.window.activeTextEditor;

	if (!editor) { return; }

	vscode.workspace.onDidChangeTextDocument(e => {
		if (e.contentChanges[e.contentChanges.length - 1].text === ';' || e.contentChanges[0].text === ';') {
			if (editor && editor.selection.isEmpty) {
				let escapeString = vscode.workspace.getConfiguration('ez-semicolon').get('escapeString');
				if (!escapeString && isInString()) {
					// console.log('returned');
					return ;
				}
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

	const newline = vscode.workspace.getConfiguration('ez-semicolon').get('newline');

	// if (lineObject.text.indexOf('for') !== -1) { return; }
	if (lineObject.text.indexOf('for ') === lineObject.firstNonWhitespaceCharacterIndex
	|| lineObject.text.indexOf('for(') === lineObject.firstNonWhitespaceCharacterIndex) {
		return;
	}

	// two adjacent semicolons at end of line
	if ((lineObject.text.charAt(cursorPos - 1) === ';' && cursorPos === lineLength - 1) || (lineObject.text.charAt(cursorPos + 1) === ';' && cursorPos === lineLength - 2)) {
		vscode.commands.executeCommand('deleteLeft').then(() => {
			if (newline) {
				vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
					// console.log('valid line after');
				}).then(undefined, err => {
					console.error(err);
				});
			}
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
		if (newline) {
			vscode.commands.executeCommand('editor.action.insertLineAfter').then(success => {
				// console.log('valid line after');
			}, err => {
				console.error(err);
			});
		}
	}
}

function isInString(): boolean {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return false;
	}

	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);
	let lineLength = lineObject.text.length;
	let cursorPos = editor.selection.active.character;

	let leftCountS = (lineObject.text.slice(0, cursorPos).match(/'/g) || []).length;
	let rightCountS = (lineObject.text.slice(cursorPos).match(/'/g) || []).length;
	
	let leftCountD = (lineObject.text.slice(0, cursorPos).match(/"/g) || []).length;
	let rightCountD = (lineObject.text.slice(cursorPos).match(/"/g) || []).length;

	if ((leftCountD % 2 === 1 && rightCountD % 2 === 1) || (leftCountS % 2 === 1 && rightCountS % 2 === 1)) {
		return true;
	}
	return false;
}

// this method is called when your extension is deactivated
export function deactivate() {}
