import { Configuration } from 'webpack';
// @ts-ignore
import { merge } from 'webpack-merge';
import { getBaseConfig } from '../common';

export default merge(getBaseConfig('base'), {
	
} as Configuration);