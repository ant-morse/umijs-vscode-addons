// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');

const showMessage = function (msg, type) {
  // vscode api
  // https://code.visualstudio.com/docs/extensionAPI/vscode-api
  vscode.window[type === 'error' ? 'showErrorMessage' : 'showInformationMessage'](msg);
}

const showInputBox = async (type, baseDirectory) => {
  try {
    const input = await vscode
      .window
      .showInputBox({
        prompt: `Enter name of Umijs ${type} to be added under: ${baseDirectory}`,
        placeHolder: `Umijs ${type} name`
      });
    return input;
  } catch (e) {
    showMessage(e, 'error')
    return;
  }
}

const createUmijsPage = async (file) => {
  // The code you place here will be executed every time your command is executed
  console.log('createUmijsPage: file', file);

  const dir = file.fsPath;
  // Display a message box to the user
  const filename = await showInputBox('page', dir);
  if (filename) {
    exec(`cd ${dir} && umi g page ${filename}`, (error, stdout, stderr) => {
      if (error) {
        showMessage(`exec error: ${error}`, 'error')
      } else {
        showMessage(`Umijs page ${filename} has been generated.`)
      }
    });
  }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "umijs-vscode-addons" is now active!');

  // The command has been defined in the package.json file Now provide the
  // implementation of the command with  registerCommand The commandId parameter
  // must match the command field in package.json

  let createUmijsPageDisposable = vscode
    .commands
    .registerCommand('extension.createUmijsPage', createUmijsPage);

  context.subscriptions.push(createUmijsPageDisposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;