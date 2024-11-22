import React from 'react';

import './Toolbar.css';

const toolbar = (props: any) => (
    <div className="toolbar">
       {props.children}
    </div>
);

export default toolbar;