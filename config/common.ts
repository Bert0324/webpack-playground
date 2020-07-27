import { Configuration } from 'webpack';
// @ts-ignore
import { merge } from 'webpack-merge';

const dir = __dirname.replace('config', '');
export const getBaseConfig = (path: string, config: Configuration): Configuration  => {
	return merge({
		mode: 'production',
		entry: `${dir}/${path}/src/index.ts`,
		devtool: 'inline-source-map',
		output: {
			path: `${dir}/dist`,
			filename: `output.${path}.js`
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		}
	}, config);
};
