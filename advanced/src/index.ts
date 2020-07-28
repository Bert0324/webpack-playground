import '../../style/less.less';
import { sumTwo } from './other';

const addBody = (className: string) => {
    const p = document.createElement('p');
    p.innerText = className;
    p.className = className;
    document.body.appendChild(p);
};

console.log(sumTwo(1, 2));

addBody('p-less');
