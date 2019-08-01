const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const getFilesFromDir = require("./config/files");
const PAGE_DIR = path.join("src", "pages", path.sep);

//const jsFiles = getFilesFromDir(PAGE_DIR, [".js"]);
const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"]).map( filePath => {
    const fileName = filePath.replace(PAGE_DIR, "");
    return new HtmlWebPackPlugin({
        chunks:[fileName.replace(path.extname(fileName), ""), "vendor"],
        template: filePath,
        filename: fileName
    })
});

const entry = getFilesFromDir(PAGE_DIR, [".js"]).reduce( (obj, filePath) => {
    const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
    obj[entryChunkName] = `./${filePath}`;
    return obj;
}, {});


module.exports = (env, argv) => ({
    // 의존성 그래프의 시작점을 웹팩에서는 엔트리(entry)라고 한다.
    entry: entry,
    // 번들된 결과물을 처리할 위치는 output에 기록한다.
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[hash:10].js"
    },
    // 비 자바스크립트 파일을 웹팩이 이해하게끔 변경해야하는데 로더가 그런 역할을 한다.
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:"babel-loader",
                    options:{
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                    }
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", {loader: "css-loader", options: {modules: true}}],
                exclude: /node_modules/,
            },
            {
                test: /\.(svg|jpg|gif|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: (url, resourcePath, context) => {
                                if(argv.mode === 'development') {
                                    const relativePath = path.relative(context, resourcePath);
                                    return `/${relativePath}`;
                                }
                                return `/assets/images/${path.basename(resourcePath)}`;
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: (url, resourcePath, context) => {
                                if(argv.mode === 'development') {
                                    const relativePath = path.relative(context, resourcePath);
                                    return `/${relativePath}`;
                                }
                                return `/assets/fonts/${path.basename(resourcePath)}`;
                            }
                        }
                    }
                ]
            }
        ]
    },
    // 로더가 파일단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다. 번들된 자바스크립트를 난독화 한다거나 특정 텍스트를 추출하는 용도로 사용할 수 있다.
    plugins: [
        ...htmlPlugins
    ],
    resolve:{
        alias:{
            src: path.resolve(__dirname, "src"),
            components: path.resolve(__dirname, "src", "components")
        }
    },
    optimization: {
        minimize: argv.mode === 'production' ? true : false,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true
                }
            }
        }
    }
});