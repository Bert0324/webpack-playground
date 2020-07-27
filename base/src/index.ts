import '../../style/css.css';
import '../../style/less.less';
import '../../style/scss.scss';
import webpackImage from '../../images/webpack_lifecycle.jpeg';

const appendImage = (imgFile: any) => {
    const image = new Image();
    image.src = imgFile;
    document.body.appendChild(image);
};

const addBody = (className: string) => {
    const p = document.createElement('p');
    p.innerText = className;
    p.className = className;
    document.body.appendChild(p);
};

addBody('p-css');
addBody('p-less');
addBody('p-scss');

// @ts-ignore
console.log(ENV);

appendImage(webpackImage);
