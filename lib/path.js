const vscode = require('vscode');

function workingspace() {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        const workingFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        return workingFolder;
    } else {
        vscode.window.showErrorMessage('No workspace folder is open');
        return null;
    }
}

function countFiles(workingFolder) {
    // Use the fs module to check folder contents
    const fs = require('fs');
    
    try {
        // Read directory contents
        const contents = fs.readdirSync(workingFolder);
        
        // Filter out hidden files/folders (those starting with .)
        const visibleContents = contents.filter(item => !item.startsWith('.'));

        const fileCount = visibleContents.length;
        return fileCount;
    } catch (error) {
        vscode.window.showErrorMessage(`Error checking workspace: ${error.message}`);
        return null;
    }
}

function isWorkspaceEmpty(workingFolder) {
    try {
        const fileCount = countFiles(workingFolder);
        
        if (fileCount === 0) {
            // Workspace is empty
            return true;
        } else {
            // Workspace is not empty
            return false;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error checking workspace: ${error.message}`);
        return null;
    }
}

module.exports = {
    workingspace: workingspace,
    countFiles: countFiles,
    isWorkspaceEmpty: isWorkspaceEmpty,
};
