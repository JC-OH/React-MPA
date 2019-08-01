const path = require("path");
const getFilesFromDir = require("../config/files");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const PAGE_DIR = path.join("..", "src", "pages", path.sep);

const htmlFiles = getFilesFromDir(PAGE_DIR, [".html"]);

const htmlPlugins = htmlFiles.map( filePath => {
    const fileName = filePath.replace(PAGE_DIR, "");
    return new HtmlWebPackPlugin({
        chunks:[fileName.replace(path.extname(fileName), ""), "vendor"],
        template: filePath,
        filename: fileName})
});

console.log("[...htmlPlugins]", [...htmlPlugins]);