import { Fragment } from 'react';

import './Layout.css';

const layout = (props: any) => (
  <Fragment>
    <header className="main-header">{props.header}</header>
    {props.mobileNav}
    <main className="content">{props.children}</main>
  </Fragment>
);

export default layout;
