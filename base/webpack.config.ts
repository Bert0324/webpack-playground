import { getBaseConfig } from '../config/common';
// @ts-ignore
import postCssEnv from 'postcss-preset-env';
import postCssImport from 'postcss-import';
import postCssCssnano from 'cssnano';
import { RuleSetUseItem } from 'webpack';

export const getCssLoader: RuleSetUseItem = (importLoaders: number) => ({
    loader: 'css-loader',
    options: {
        // <https://github.com/webpack-contrib/css-loader#importloaders>
        importLoaders
    }
});

export const PostCssLoader: RuleSetUseItem = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        // <https://github.com/postcss/postcss-loader#plugins>
        plugins: (loader: any) => ([
            postCssImport({ root: loader.resourcePath }),
            postCssEnv(),
            postCssCssnano()
        ])
    }
}

export default getBaseConfig(dir => ([{
    entry: `${dir}/base/src/index.ts`,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    getCssLoader(1),
                    PostCssLoader
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    getCssLoader(2),
                    PostCssLoader,
                    'less-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                loader: [
                    'style-loader',
                    getCssLoader(2),
                    PostCssLoader,
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    /**
                     * based on file-loader
                     * <https://webpack.js.org/loaders/url-loader/>
                     */
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024 * 1024, // less than 5mb to compile as base64
                        outputPath: '/images/'
                    }
                }
            }
        ]
    }
}]));