const JsonBeautify = require("json-beautify");

const packageJson = (packageName) => {
    return JsonBeautify(
        {
            name: packageName,
            private: true,
            version: "0.1.0",
            description: packageName,
            author: "",
            license: "",
            scripts: {
                start: "webpack serve --config webpack.config.js --mode development",
                build: "webpack --config webpack.config.js --mode production",
                "build:analyze":
                    "webpack --config webpack.config.js --mode production --analyze",
                generact: "generact",
                test: 'echo "Error: no test specified" && exit 0',
            },
            browserslist: {
                production: [">0.2%", "not dead", "not op_mini all"],
                development: [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version",
                ],
            },
        },
        null,
        2,
        90
    );
};

module.exports = { packageJson };
