const vscode = require('vscode');
const runner = require('./lib/runner');
const importGist = require('./lib/importGist');
const publishAsGist = require('./lib/publishAsGist');
const githubAuth = require('./lib/githubAuth');
const createNew = require('./lib/createNew');
const report = require('./lib/reportIssues');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('electron fiddle extension: actived!');

	const runFiddle = vscode.commands.registerCommand('electron-fiddle.run', async () => {
		runner.run();
	});

	context.subscriptions.push(runFiddle);

	const bisectFiddle = vscode.commands.registerCommand('electron-fiddle.bisect', async () => {
		runner.bisect();
	});

	context.subscriptions.push(bisectFiddle);

	const importFiddle = vscode.commands.registerCommand('electron-fiddle.import', async () => {
		importGist.importGistAsFiddle();
	});

	context.subscriptions.push(importFiddle);

	const publishFiddle = vscode.commands.registerCommand('electron-fiddle.publish', async () => {
		publishAsGist.publishAsGist();
	});

	context.subscriptions.push(publishFiddle);

	const switchAcc = vscode.commands.registerCommand('electron-fiddle.switchAccount', async () => {
		githubAuth.switchAccount();
	});

	context.subscriptions.push(switchAcc);

	const createNewFiddle = vscode.commands.registerCommand('electron-fiddle.createNewFiddle', async () => {
		createNew.createNewFiddle(context);
	});

	context.subscriptions.push(createNewFiddle);

	const reportIssue = vscode.commands.registerCommand('electron-fiddle.reportIssue', async () => {
		report.reportIssue();
	});

	context.subscriptions.push(reportIssue);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
