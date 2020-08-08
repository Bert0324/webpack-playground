import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// @ts-ignore
import DashboardPlugin from 'webpack-dashboard/plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
// @ts-ignore
import SizePlugin from 'size-plugin';
import { getBaseConfig } from "../config/common";

const smp = new SpeedMeasurePlugin();
export default getBaseConfig(dir => ([smp.wrap({
    entry: {
        index: `${dir}/analyzer/src/index.ts`,
    },
    plugins: [
        // `yarn analyze` to look it
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true
        }),
        new DashboardPlugin(),
        new SizePlugin()
    ]
})]));