const vscode = require('vscode');

function reportIssue() {
    const githubNewIssueLink = "https://github.com/JiScriptedHu/electron-fiddle-vscode-extension/issues/new";

    vscode.window.showInformationMessage(
        "Would you like to report a new issue?", 
        'Yes'
    ).then(selection => {
        if (selection === 'Yes') {
            vscode.env.openExternal(vscode.Uri.parse(githubNewIssueLink));
        }
    });
}

module.exports = {
    reportIssue: reportIssue,
}