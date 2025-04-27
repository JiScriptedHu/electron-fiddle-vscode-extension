const vscode = require('vscode');

async function getGithubToken() {
    try {
        // Get a Github session
        const session = await vscode.authentication.getSession(
            'github',
            ['gist'],
            { createIfNone: true }
        );

        if(session){
            vscode.window.showInformationMessage(`Signed in as ${session.account.label}`);
        }

        if(!session){
            vscode.window.showErrorMessage('Github authentication failed');
            return;
        }

        return session;
    } catch (err) {
        vscode.window.showErrorMessage(`Github authentication error: ${err.message}`);
    }
}

async function switchAccount() {
    try {
        // Get a Github session
        const session = await vscode.authentication.getSession(
            'github',
            ['gist'],
            {
                createIfNone: false,
                forceNewSession: true
            }
        );

        if(session){
            vscode.window.showInformationMessage(`Signed in as ${session.account.label}`);
        }

        if(!session){
            vscode.window.showErrorMessage('Github authentication failed');
            return;
        }

        return session;
    } catch (err) {
        vscode.window.showErrorMessage(`Github authentication error: ${err.message}`);
    }
}

module.exports = {
    getGithubToken: getGithubToken,
    switchAccount: switchAccount,
};