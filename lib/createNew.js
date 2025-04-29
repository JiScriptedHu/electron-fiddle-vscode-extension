const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const workspace = require('./path');

function createNewFiddle(context) {
    // Get the workspace folder path
    const workingFolder = workspace.workingspace();
    if (!workingFolder) {
        return; // No workspace or error, stop execution
    }

    const workFolderEmpty = workspace.isWorkspaceEmpty(workingFolder);
    if (workFolderEmpty === false) {
        // Workspace is not empty, stop execution
        vscode.window.showInformationMessage(`Please use an empty folder/workspace. Current workspace contains ${workspace.countFiles(workingFolder)} items.`);
        return;
    } else if (workFolderEmpty === null) {
        // No workspace or error, stop execution
        return;
    }
    
    // Get the extension path directly from context
    const extensionPath = context.extensionPath;
    const templateFolderPath = path.join(extensionPath, 'newFiddleTemplate');
    
    // If template folder doesn't exist in the extension
    if (!fs.existsSync(templateFolderPath)) {
        vscode.window.showErrorMessage('Template folder not found in extension');
        return;
    }
    
    try {
        // Copy directory recursively to working folder
        copyDirectoryRecursively(templateFolderPath, workingFolder);
        
        vscode.window.showInformationMessage(`New fiddle created successfully!`);
        return;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create template files: ${error.message}`);
        console.error(error);
        return;
    }
}

function copyDirectoryRecursively(source, target) {
    
    // Read all items from source directory
    const items = fs.readdirSync(source);
    
    // Process each item
    items.forEach(item => {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);
        
        const stats = fs.statSync(sourcePath);
        
        if (stats.isFile()) {
            // Copy file
            const content = fs.readFileSync(sourcePath);
            fs.writeFileSync(targetPath, content);
        } else if (stats.isDirectory()) {
            // Create the target directory if it doesn't exist
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }
            
            // Recursively copy subdirectory
            copyDirectoryRecursively(sourcePath, targetPath);
        }
    });
    
    return;
}

module.exports = {
    createNewFiddle: createNewFiddle,
}