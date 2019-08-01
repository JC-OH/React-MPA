const path = require("path");
const getFilesFromDir = require("../config/files");
const PAGE_DIR = path.join("..", "src", "pages", path.sep);

const entry = getFilesFromDir(PAGE_DIR, [".js"]).reduce( (obj, filePath) => {
    const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
    obj[entryChunkName] = `./${filePath}`;
    return obj;
}, {});

console.log("path.sep", path.sep);
console.log("PAGE_DIR", PAGE_DIR);
console.log("entry", entry);
