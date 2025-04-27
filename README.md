## electron-fiddle-vscode-extension

Run Fiddles without leaving the IDE, using a local build of an Electron release

## About

This extension is a concept for one of Electron's Google Summer of Code 2025 projects: `🚀 Electron Fiddle in VS Code`

The idea is to take the internals of Electron Fiddle and integrate them as a VS Code extension, allowing the use of Fiddle’s logic without leaving the IDE, and making it easier to work with a local build of Electron.

## Features

This concept version of electron-fiddle-vscode-extension contains basic features like:
- Running Fiddles `current electron version is static, and can't be taken as input from user`
- Bisecting Fiddles `current electron version is static, and can't be taken as input from user`
- Importing Gist as Fiddle
- Publishing Fiddle as Gist `either publicly or secretly`
- Switching GitHub accounts `for import/export without signing out globally`

## Features to be added

Features currently being worked on and will be added soon:
- Take Electron version as input from user `allow users to select the Electron version for running and bisecting, efficiently`
- Running Fiddles from a custom path `enabling users to define a path through which the Fiddle runs`
- Bisecting Fiddles from a custom path `enabling users to define a path through which the Fiddle bisects`
- New Fiddle option `to initialize a simple Fiddle`
- Electron Manager `to download, install, and manage local Electron versions efficiently`

## Features which can be added

Features that could be implemented in upcoming versions:
- Settings option `to allow users to customize the extension's default paths and preferences`
- Keyboard shortcuts `for faster and easier operations`
- Better UI `to improve user interaction with the extension`

## Features which will be great to add (may require increased time and difficulty)

These functions are more complex and may require additional time and effort to implement:
- Save as Forge
- Make Package Fiddle
- Make Installer for Fiddle