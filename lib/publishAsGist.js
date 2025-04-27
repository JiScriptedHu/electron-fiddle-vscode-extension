const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const githubAuth = require('./githubAuth');

async function publishAsGist() {
    try {
        // Get fiddle name from user
        const fiddleName = await vscode.window.showInputBox({
            prompt: `Enter fiddle's name`,
            placeHolder: 'fiddle name',
            validateInput: (name) => {
                if (name.length > 0) {
                    return null;
                } else {
                    return 'Please enter a vaild name';
                }
            },
        });

        if (!fiddleName) {
            // User canceled the input
            return;
        }

        let isGistPublic = true;

        // Get fiddle name from user
        const gistType = await vscode.window.showQuickPick(['Public gist', 'Private gist']);
        if (gistType === 'Public gist') {
            isGistPublic = true;
        } else if (gistType === 'Private gist') {
            isGistPublic = false;
        } else {
            return;
        }

        // Get Github access token using VS Code's built-in authentication
        const session = await githubAuth.getGithubToken();
        if (!session) return; // Exit if authentication failed

        //Import the Octokit Rest library
        const { Octokit } = await import('@octokit/rest');

        //Create an Octokit instance with the token
        const octokit = new Octokit({
            auth: session.accessToken,
        });

        // Read workspace files recursively
        function readFilesRecursively(dir, rootDir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            const files = ({});

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(rootDir, fullPath);
                
                if (entry.isDirectory()) {
                    // Merge results from subdirectories
                    Object.assign(files, readFilesRecursively(fullPath, rootDir));
                } else {
                    // Use relative path as key for the file
                    files[relativePath] = { content: fs.readFileSync(fullPath, 'utf8'),};
                }
            }

            return files;
        }

        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const files = readFilesRecursively(workspaceFolder, workspaceFolder);

        // Create gist
        const response = await octokit.gists.create({
            files,
            description: fiddleName,
            public: isGistPublic,
        });

        // Show success message with the gist URL
        vscode.window.showInformationMessage(
            `Gist created: ${response.data.html_url}`,
            'Open in Browser'
        ).then(selection => {
            if (selection === 'Open in Browser') {
                vscode.env.openExternal(vscode.Uri.parse(response.data.html_url));
            }
        });

        console.log(response.data.html_url);
    } catch (err) {
        vscode.window.showErrorMessage(`Error creating gist: ${err.message}`);
        console.error(err);
    }
}

module.exports = {
    publishAsGist: publishAsGist,
}