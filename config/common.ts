import { Configuration } from 'webpack';

export const getBaseConfig = (path: string): Configuration  => {
	const dir = __dirname.replace('config', '');
	return {
		mode: 'production',
		entry: `${dir}/src/index.ts`,
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
	};
};
