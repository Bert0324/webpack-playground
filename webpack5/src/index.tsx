import React from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
import styles from './index.less';

const App= () => {
  return <Button className={styles.app}>123</Button>;
};

render(<App />, document.getElementById('app'));
