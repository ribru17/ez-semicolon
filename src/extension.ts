// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const formattedDisp = vscode.commands.registerCommand('ez-semicolon.semicolonFormatted', () => {
		semicolonAtEnd();
	});

	const noNewlineDisp = vscode.commands.registerCommand('ez-semicolon.semicolonNoNewline', () => {
		semicolonAtEnd(true)
	})

	const defaultDisp = vscode.commands.registerCommand('ez-semicolon.semicolonDefault', () => {
		semicolonDefault();
	});

	context.subscriptions.push(formattedDisp);
	context.subscriptions.push(noNewlineDisp);
	context.subscriptions.push(defaultDisp);
}

function semicolonAtEnd(noNewlineCmd?: boolean) {
	
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return;
	}

	// if cursor is in a string and it should not be formatted
	// i.e. escapeString setting is false and user is not coming from ctrl+; command
	let escapeString = vscode.workspace.getConfiguration('ez-semicolon').get('escapeString');
	if (!escapeString && !noNewlineCmd && isInString()) {
		vscode.commands.executeCommand("type", { text: ';' }).then(success => {
			// console.log('valid type');
		}).then(undefined, err => {
			console.error(err);
		});
		return;
	}

	// if line is a for loop do not format semicolons
	if (isInFor()) {
		vscode.commands.executeCommand("type", { text: ';' }).then(success => {
			// console.log('valid type');
		}).then(undefined, err => {
			console.error(err);
		});
		return;
	}

	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);
	let lineLength = lineObject.text.length;

	// last character in line is NOT a semicolon
	if (lineObject.text.charAt(lineLength - 1) !== ';') {
		vscode.commands.executeCommand('cursorEnd').then(success => {
	
		}).then(undefined, err => {
			console.error(err);
		});
	
		vscode.commands.executeCommand("type", { text: ';' }).then(success => {
			// console.log('valid type');
		}).then(undefined, err => {
			console.error(err);
		});
	}

	// don't insert newline if coming from ctrl+; command
	if (noNewlineCmd) return;

	const newline = vscode.workspace.getConfiguration('ez-semicolon').get('newline');

	if (newline && !isReturnStatement()) {
		vscode.commands.executeCommand('editor.action.insertLineAfter').then(success => {
	
		}).then(undefined, err => {
			console.error(err);
		});
	}
}

function semicolonDefault() {
	vscode.commands.executeCommand("type", { text: ';' }).then(success => {
		// console.log('valid type');
	}).then(undefined, err => {
		console.error(err);
	});
}

function isReturnStatement(): boolean {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return false;
	}
	
	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);
	let lowercaseLine = lineObject.text.toLowerCase();

	return lowercaseLine.indexOf('return ') === lineObject.firstNonWhitespaceCharacterIndex
	|| lowercaseLine.trim() === 'return' || lowercaseLine.trim() === 'return;';
}

function isInFor(): boolean {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return false;
	}

	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);

	return (lineObject.text.indexOf('for ') === lineObject.firstNonWhitespaceCharacterIndex
	|| lineObject.text.indexOf('for(') === lineObject.firstNonWhitespaceCharacterIndex);
}

function isInString(): boolean {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		console.error('no editor');
		return false;
	}

	let lineIndex = editor.selection.active.line;
	let lineObject = editor.document.lineAt(lineIndex);
	let cursorPos = editor.selection.active.character;

	// amount of single quotes on either side of the cursor
	let leftCountS = (lineObject.text.slice(0, cursorPos).match(/'/g) || []).length;
	let rightCountS = (lineObject.text.slice(cursorPos).match(/'/g) || []).length;
	
	// amount of double quotes on either side of the cursor
	let leftCountD = (lineObject.text.slice(0, cursorPos).match(/"/g) || []).length;
	let rightCountD = (lineObject.text.slice(cursorPos).match(/"/g) || []).length;

	// return true if there are an odd amount of single or double quotes on both sides of the cursor
	if ((leftCountD % 2 === 1 && rightCountD % 2 === 1) || (leftCountS % 2 === 1 && rightCountS % 2 === 1)) {
		return true;
	}
	return false;
}

// this method is called when your extension is deactivated
export function deactivate() {}
