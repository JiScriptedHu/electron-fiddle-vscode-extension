const vscode = require('vscode');
const path = require('path');
const { TextEncoder } = require('util');
const workspace = require('./path');
const githubAuth = require('./githubAuth');

async function importGistAsFiddle() {
    try {    
        const workspacePath = workspace.workingspace();
        // Check workspace condition first
        const workFolderEmpty = workspace.isWorkspaceEmpty(workspacePath);
        if (workFolderEmpty === false) {
            // Workspace is not empty, stop execution
            vscode.window.showInformationMessage(`Please use an empty folder/workspace. Current workspace contains ${workspace.countFiles(workspacePath)} items.`);
            return;
        } else if (workFolderEmpty === null) {
            // No workspace or error, stop execution
            return;
        }
        
        // Continue with execution only if workFolderEmpty === true
        const gistUrl = await getGistUrl();
        if (!gistUrl) {
            // User canceled the input
            return;
        }

        // Get Github access token using VS Code's built-in authentication
        const session = await githubAuth.getGithubToken();
        if (!session) return; // Exit if authentication failed
        
        const { Octokit } = await import("@octokit/rest");
        
        const octokit = new Octokit({
            auth: session.accessToken
        });
        
        const gistId = String(gistUrl).split("/").pop();

        try {
            const response = await octokit.request("GET /gists/{gist_id}", {
            gist_id: gistId,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
            });

            console.log(response);
            const files = response.data.files;
            
            for (const [filename, file] of Object.entries(files)) {
                const filePath = vscode.Uri.file(path.join(workspacePath, filename)
                );
                
                const encoder = new TextEncoder();
                const data = encoder.encode(file.content);
                await vscode.workspace.fs.writeFile(filePath, data);
            }

            const fileNames = Object.keys(files);

             // Add user feedback for successful import
            if (fileNames.length > 0) {
                vscode.window.showInformationMessage(
                    `Successfully imported ${fileNames.length} files from gist`
                )
            } else {
                vscode.window.showInformationMessage('Gist imported successfully, but it contained no files');
            }
            
        } catch (error) {
            vscode.window.showErrorMessage(`Error fetching gist: ${error.message}`);
            console.error(error);
        }
    } catch (err) {
        vscode.window.showErrorMessage(`Error importing gist: ${err.message}`);
        console.error(err);
    }
}

async function getGistUrl() {
    const url = await vscode.window.showInputBox({
        prompt: "Enter the fiddle's github gist URL",
        placeHolder: "https://gist.github.com/username/gist_id",
        validateInput: (url) => {
        if (url.startsWith("https") && url.includes("gist.github.com")) {
            return null;
        } else {
            return "Please enter a valid github gist URL";
        }
        },
    });
    return url;
}

module.exports = {
    importGistAsFiddle: importGistAsFiddle,
};