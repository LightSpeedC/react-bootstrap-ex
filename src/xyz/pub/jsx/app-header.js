'use strict';

import React from 'react';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

const AppHeader = props =>
	<Navbar collapseOnSelect>
		<Navbar.Header>
			<Navbar.Brand>
				React-Bootstrap
			</Navbar.Brand>
			<Navbar.Toggle />
		</Navbar.Header>
		<Navbar.Collapse>
			<Nav>
				<NavItem eventKey={1} href="/xyz/pub/">xyz</NavItem>
				<NavDropdown eventKey={3} title="Examples" id="basic-nav-dropdown">
					<MenuItem eventKey={3.1} href="/ex01-react-intro-js/">ex01-react-intro-js</MenuItem>
					<MenuItem eventKey={3.2} href="/ex02-react-intro-jsx/">ex02-react-intro-jsx</MenuItem>
					<MenuItem eventKey={3.3} href="/ex03-react-gulp/">ex03-react-gulp</MenuItem>
					<MenuItem eventKey={3.4} href="/ex10-bootstrap3/">ex10-bootstrap3</MenuItem>
					<MenuItem eventKey={3.5} href="/ex11-react-bootstrap-jsx/">ex11-react-bootstrap-jsx</MenuItem>
					<MenuItem divider />
					<NavDropdown eventKey={3} title="Examples" id="basic-nav-dropdown">
						<MenuItem eventKey={3.1} href="/ex01-react-intro-js/">ex01-react-intro-js</MenuItem>
						<MenuItem eventKey={3.2} href="/ex02-react-intro-jsx/">ex02-react-intro-jsx</MenuItem>
						<MenuItem eventKey={3.3} href="/ex03-react-gulp/">ex03-react-gulp</MenuItem>
						<MenuItem eventKey={3.4} href="/ex10-bootstrap3/">ex10-bootstrap3</MenuItem>
						<MenuItem eventKey={3.5} href="/ex11-react-bootstrap-jsx/">ex11-react-bootstrap-jsx</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey={3.6} href="/">Home</MenuItem>
					</NavDropdown>
					<MenuItem eventKey={3.6} href="/">Home</MenuItem>
				</NavDropdown>
				<NavItem eventKey={4} href="/">Home</NavItem>
			</Nav>
			<Nav pullRight>
				<NavItem eventKey={1} href="#">Link1 Right</NavItem>
				<NavItem eventKey={2} href="#">Link2 Right</NavItem>
			</Nav>
		</Navbar.Collapse>
	</Navbar>;

export default AppHeader;
