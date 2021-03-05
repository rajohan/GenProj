#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");
const { spawn } = require("cross-spawn");
const validateNpmPackageName = require("validate-npm-package-name");

const { questions } = require("./questions");
const { dependencies, devDependencies, tsDevDependencies } = require("./dependencies");
const { babelrcJs, babelRcTs } = require("./fileTemplates/babel");
const { packageJson } = require("./fileTemplates/packageJson");
const { indexFile, appFile, homeFile } = require("./fileTemplates/react");

const run = (cmd, args, path = process.cwd()) => {
    return new Promise((resolve, reject) => {
        const command = spawn(cmd, args, {
            cwd: path,
            env: process.env,
            stdio: "inherit",
        });

        command.on("close", () => {
            resolve();
        });

        command.on("error", (error) => {
            reject(error);
        });
    });
};

program.arguments("[dir]");
program.action(async (dir) => {
    const packageName = path.basename(dir).toLowerCase();
    const fullPath = path.join(process.cwd(), dir);
    const isValid = validateNpmPackageName(packageName);

    if (!isValid.validForNewPackages) {
        return console.error(
            chalk.red(`\nError: "${packageName}" is not a valid package.json name\n`)
        );
    }

    let answers;

    try {
        answers = await questions();
    } catch (error) {
        console.error(error);
    }

    const { language, pkgm, libraries } = answers;

    dependencies.push(...libraries);

    if (libraries.includes("redux")) {
        dependencies.push("react-redux", "@reduxjs/toolkit", ...answers.reduxLibraries);
        devDependencies.push("redux-devtools-extension");
    }

    if (language === "ts") {
        devDependencies.push(...tsDevDependencies);

        if (libraries.includes("redux")) {
            devDependencies.push("@types/react-redux");
        }

        if (libraries.includes("react-helmet-async")) {
            devDependencies.push("@types/react-helmet-async");
        }

        if (libraries.includes("styled-components")) {
            devDependencies.push("@types/styled-components");
        }
    }

    try {
        await fs.emptyDir(fullPath);

        await fs.outputFile(
            path.join(fullPath, ".babelrc"),
            language === "ts" ? babelRcTs : babelrcJs,
            "utf-8"
        );

        await fs.outputFile(
            path.join(fullPath, "package.json"),
            packageJson(packageName),
            "utf-8"
        );

        await fs.copy("./ignoreFiles", fullPath);
        await fs.copy("./configFiles/shared", fullPath);
        await fs.copy("./otherFiles", fullPath);
        await fs.copy("./webpack", fullPath);
        await fs.copy("./structure", fullPath);

        const fileEndings = language === "ts" ? ".tsx" : ".js";

        await fs.outputFile(
            path.join(fullPath, "src", "index" + fileEndings),
            indexFile,
            "utf-8"
        );

        await fs.outputFile(
            path.join(fullPath, "src", "components", "App" + fileEndings),
            appFile,
            "utf-8"
        );

        await fs.outputFile(
            path.join(fullPath, "src", "pages", "Home" + fileEndings),
            homeFile,
            "utf-8"
        );

        if (language === "ts") {
            await fs.copy("./configFiles/ts", fullPath);
        } else {
            await fs.copy("./configFiles/js", fullPath);
        }

        if (pkgm === "npm") {
            await run("npm", ["install", ...dependencies], fullPath);
            await run(
                "npm",
                ["install", "--save-dev", ...devDependencies, "--legacy-peer-deps"],
                fullPath
            );
        } else {
            await run("yarn", ["add", ...dependencies], fullPath);
            await run("yarn", ["add", "--dev", ...devDependencies], fullPath);
        }
    } catch (error) {
        console.error(error);
    }

    console.log(chalk.green(`\n🔥 All done! Your project is now ready in ${dir} 🔥\n`));
});

program.parse(process.argv);
