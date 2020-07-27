import { Configuration, DefinePlugin } from 'webpack';
// @ts-ignore
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// @ts-ignore
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const dir = __dirname.replace('config', '');
export const getBaseConfig = (
	path: string,
	getConfig: (dir: string) => Configuration[]
): Configuration => (merge({
	mode: 'production',
	entry: `${dir}/${path}/src/index.ts`,
	devtool: 'inline-source-map',
	output: {
		path: `${dir}/dist`,
		filename: `output.[contentHash:8].js`
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				/**
				 * loader is from back to end within the array to load
				 * `ts-loader` already includes `babel-loader`
				 * <https://github.com/TypeStrong/ts-loader/blob/master/package.json>
				 */
				loader: ['ts-loader'],
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
			template: `${dir}/public/index.html`
		}),
		// define variables in runtime
		new DefinePlugin({
			ENV: JSON.stringify('production')
		}),
		// clean output file before build 
		new CleanWebpackPlugin()
	],
	devServer: {
		contentBase: `${dir}/dist/index.html`,
		compress: true,
		port: 8081,
		open: true,
		proxy: {

		}
	}
} as Configuration, ...getConfig(dir)))
