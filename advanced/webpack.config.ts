import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import { getBaseConfig } from "../config/common";
import { getCssLoader, PostCssLoader } from "../base/webpack.config";

export default getBaseConfig(dir => ([{
    /**
     * use different files as entry file
     * `output` use `[name]` as file name
     */
    entry: {
        index: `${dir}/advanced/src/index.ts`,
        other: `${dir}/advanced/src/other.ts`,
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    // use separated css file instead of <style>
                    MiniCssExtractPlugin.loader,
                    getCssLoader(2),
                    PostCssLoader,
                    'less-loader'
                ]
            },
        ]
    },
    plugins: [
        // use separated css file instead of <style>
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contentHash:8].css'
        }),
        
    ],
    optimization: {
        minimizer: [
            /**
             * minimize js file
             * <https://webpack.js.org/plugins/terser-webpack-plugin/>
             */
            new TerserWebpackPlugin({}),
            /**
             * minimize css file
             * <https://github.com/NMFR/optimize-css-assets-webpack-plugin>
             */
            new OptimizeCssAssetsWebpackPlugin({})
        ]
    }
}]));