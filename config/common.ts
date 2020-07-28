import { Configuration, DefinePlugin } from 'webpack';
// @ts-ignore
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// @ts-ignore
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const dir = __dirname.replace('config', '');
export const getBaseConfig = (
	getConfig: (dir: string) => Configuration[]
): Configuration => (merge({
	mode: 'production',
	devtool: 'inline-source-map',
	output: {
		path: `${dir}/dist`,
		filename: `[name].[contentHash:8].js`
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts|js)?$/,
				/**
				 * babel7, is different tsc and ts-loader
				 */
				loader: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: true
						}
					}
				],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: `${dir}/public/index.html`,
		}),
		// define variables in runtime
		new DefinePlugin({
			ENV: JSON.stringify('production')
		}),
		// clean output file
		new CleanWebpackPlugin()
	],
	devServer: {
		contentBase: `${dir}/dist`,
		compress: true,
		port: 8081,
		open: true,
		proxy: {

		}
	}
} as Configuration, ...getConfig(dir)))
