import '../../style/less.less';

const addBody = (className: string) => {
    const p = document.createElement('p');
    p.innerText = className;
    p.className = className;
    document.body.appendChild(p);
};

addBody('p-less');
