import { getBaseConfig } from "../config/common";

export default getBaseConfig(dir => ([{
    /**
     * use different files as entry file
     * `output` use `[name]` as file name
     */
    entry: {
        index: `${dir}/advanced/src/index.ts`,
        other: `${dir}/advanced/src/other.ts`,
    }
}]));