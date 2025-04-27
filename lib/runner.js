const Fiddle = require('@electron/fiddle-core');
const path = require('./path');
const semver = require('semver');
const vscode = require('vscode');
const importGist = require('./importGist');

async function run() {
    try {
        const fiddlePath = path.workingspace();
        const workFolderEmpty = path.isWorkspaceEmpty(fiddlePath);
        if (workFolderEmpty === true) {
            console.log('Workspace folder is empty.');
            vscode.window.showErrorMessage('No workspace folder is open.');
            const continueFunction = await ifWorkFolderEmpty();
            if (continueFunction === false) {
                console.log('Operation cancelled by user.');
                return;
            }
        } else if (workFolderEmpty === null) {
            console.log('No workspace folder is open. Exiting!');
            // No workspace or error, stop execution
            return;
        }

        const electronVer = '35.1.5';
        const filteredEnv = Object.fromEntries(
            Object.entries(process.env).filter(
                ([key]) => !key.startsWith("ELECTRON_")
            )
        );

        const runner = await Fiddle.Runner.create();
        const result = await runner.run(electronVer, fiddlePath, {
            env: filteredEnv
        });

        const status = Fiddle.Runner.displayResult(result);
        console.log(status);
    } catch (err) {
        console.error('Error running Fiddle:', err);
    }
}

async function bisect() {
    try {
        const fiddlePath = path.workingspace();
        const workFolderEmpty = path.isWorkspaceEmpty(fiddlePath);
        if (workFolderEmpty === true) {
            console.log('Workspace folder is empty.');
            vscode.window.showErrorMessage('No workspace folder is open.');
            const continueFunction = await ifWorkFolderEmpty();
            if (continueFunction === false) {
                console.log('Operation cancelled by user.');
                return;
            }
        } else if (workFolderEmpty === null) {
            console.log('No workspace folder is open. Exiting!');
            // No workspace or error, stop execution
            return;
        }

        const electronStartVer = new semver.SemVer('35.1.0');
        const electronEndVer = new semver.SemVer('35.1.5');
        
        const filteredEnv = Object.fromEntries(
            Object.entries(process.env).filter(
                ([key]) => !key.startsWith("ELECTRON_")
            )
        );

        const runner = await Fiddle.Runner.create();
        
        await runner.bisect(electronStartVer, electronEndVer, fiddlePath, {
            env: filteredEnv,
            out: process.stdout,
            showConfig: true
        });
    } catch (err) {
        console.error('Error bisecting Fiddle:', err);
    }
}

async function ifWorkFolderEmpty() {
    const selected = await vscode.window.showQuickPick(['Cancel', 'Import from Gist']);
    if (selected === 'Import from Gist') {
        await importGist.importGistAsFiddle();
        return true;
    } else if (selected === 'Cancel' || selected === undefined || selected == null) {
        return false;
    }
    return false;
}

module.exports = {
    run: run,
    bisect: bisect,
};
