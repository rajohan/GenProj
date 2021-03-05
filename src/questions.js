const inquirer = require("inquirer");

const questions = () =>
    inquirer
        .prompt([
            {
                type: "list",
                name: "language",
                message: "Programming language",
                choices: [
                    { name: "JavaScript", value: "js" },
                    { name: "TypeScript", value: "ts" },
                ],
                default: 0,
            },
            {
                type: "list",
                name: "pkgm",
                message: "Package Manager",
                choices: [
                    { name: "NPM", value: "npm" },
                    { name: "Yarn", value: "yarn" },
                ],
                default: 0,
            },
            {
                type: "checkbox",
                name: "libraries",
                message: "Libraries",
                choices: [
                    { name: "Axios", value: "axios", checked: true },
                    {
                        name: "React Helmet Async",
                        value: "react-helmet-async",
                        checked: true,
                    },
                    { name: "Redux", value: "redux", checked: false },
                    {
                        name: "Styled Components",
                        value: "styled-components",
                        checked: false,
                    },
                ],
            },
            {
                type: "checkbox",
                name: "reduxLibraries",
                message: "Redux libraries",
                when: (answers) => answers.libraries.includes("redux"),
                choices: [
                    { name: "Redux Thunk", value: "redux-thunk", checked: false },
                    { name: "Redux-Saga", value: "redux-saga", checked: false },
                    { name: "Reselect", value: "reselect", checked: false },
                ],
            },
        ])
        .catch((error) => console.log(error));

module.exports = { questions };
