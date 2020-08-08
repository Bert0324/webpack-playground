
/**
 * tree shaking must use es6 `import`, not commonJs,
 * set `"sideEffects": false,` or `"sideEffects": [],` in package.json
 * lodash use commonJs not `import`, instead, use lodash-es
 * <https://www.webpackjs.com/guides/tree-shaking/>
 */
import { sum } from 'lodash';

export const sumTwo = (a, b) => sum([a, b]);
console.log('other');