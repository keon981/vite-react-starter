#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);

if (fs.existsSync(projectDir)) {
  console.error(`Error: Directory ${projectName} already exists.`);
  process.exit(1);
}

fs.ensureDirSync(projectDir); // creates if not exists

/**
 * Store the base project structure inside a `template` folder.
 * This folder contains all files to scaffold a new project.
 */
const templateDir = path.resolve(__dirname, '../template');
fs.cpSync(templateDir, projectDir, { recursive: true, });

/** To avoid dotfiles being included in the template repo,
  we store them without a dot and rename them after copying. */
['gitignore', 'npmrc', 'env'].forEach((file) => {
  fs.renameSync(
    path.join(projectDir, file),
    path.join(projectDir, `.${file}`)
  );
});

const projectPackageJsonPath = path.join(projectDir, 'package.json');
const projectPackageJson = fs.readJsonSync(projectPackageJsonPath);

projectPackageJson.name = projectName;


projectPackageJson.version = "0.0.1";

fs.writeJsonSync(projectPackageJsonPath, projectPackageJson, { spaces: 2 });

console.log(`
  Success! ${projectName} is ready.
  To get started:
    cd ${projectName}
    npm install
    npm run dev
  or
    yarn
    yarn dev
  or
    pnpm
    pnpm dev
  Happy coding!
`);
