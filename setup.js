#!/usr/bin/env node

const { execSync } = require("child_process");
const { input, select } = require("@inquirer/prompts");
const path = require("path");
const TEMPLATE_REPO_URL = "https://github.com/Troll321/next-competition-backend-template";

const execCommand = (command, options = {}) => {
    try {
        execSync(command, { stdio: "inherit", ...options });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
};

const setupRepository = async (projectName, packageManager) => {
    execCommand(`git clone --depth=1 ${TEMPLATE_REPO_URL} ${projectName}`);

    const projectPath = path.join(process.cwd(), projectName);
    let installCommand;
    switch (packageManager) {
        case "npm":
            installCommand = "npm install";
            break;
        case "pnpm":
            installCommand = "pnpm install";
            break;
        case "yarn":
            installCommand = "yarn install";
            break;
        case "bun":
            installCommand = "bun install";
            break;
        default:
            installCommand = "";
    }
    fs.rmSync(path.join(projectPath, ".git"), { recursive: true });
    execCommand("git init", { cwd: projectPath });
    execCommand("git add .", { cwd: projectPath });
    execCommand('git commit -m "Initial commit"', { cwd: projectPath });

    if (installCommand !== "") {
        execCommand(installCommand, { cwd: projectPath });
    }
};

const main = async () => {
    const projectName = await input({ message: "Project name: " });
    const packageManager = await select({
        message: "Package manager?: ",
        choices: [
            { value: "npm" },
            { value: "pnpm" },
            { value: "yarn" },
            { value: "bun" },
            { value: "none", description: "If selected, won't try to download packages. You then should manually download packages." },
        ],
    });

    await setupRepository(projectName, packageManager);
};

main().catch((err) => {
    console.error(err.name ?? err);
});
