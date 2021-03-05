const JsonBeautify = require("json-beautify");

const babelrcJs = JsonBeautify(
    {
        presets: [["react-app", { runtime: "automatic" }]],
    },
    null,
    2,
    90
);

const babelRcTs = JsonBeautify(
    {
        presets: [
            ["react-app", { runtime: "automatic", flow: false, typescript: true }],
            "@babel/preset-typescript",
        ],
    },
    null,
    2,
    90
);

module.exports = { babelrcJs, babelRcTs };
