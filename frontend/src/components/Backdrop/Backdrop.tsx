import ReactDOM from 'react-dom';

import './Backdrop.css';

const backdrop = (props: any) =>
  ReactDOM.createPortal(
    <div
      className={['backdrop', props.open ? 'open' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')!
  );

export default backdrop;
