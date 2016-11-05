'use strict';

import React from 'react';
//import ReactBootstrap from 'react-bootstrap';

export class Component extends React.Component {
	constructor(props) {
		super(props);
		Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(p => (p.substr(0, 2) === 'on' || p.substr(0, 6) === 'handle') &&
				typeof this[p] === 'function')
			.forEach(p => Object.defineProperty(this, p,
				{configurable: true, value: this[p].bind(this)}));
	}
}

// Button ボタン
export const Button = props =>
	<ReactBootstrap.Button {...props}/>;
export const PrimaryButton = props =>
	<ReactBootstrap.Button bsStyle="primary" {...props}/>;
export const SuccessButton = props =>
	<ReactBootstrap.Button bsStyle="success" {...props}/>;
export const WarningButton = props =>
	<ReactBootstrap.Button bsStyle="warning" {...props}/>;
export const InfoButton = props =>
	<ReactBootstrap.Button bsStyle="info" {...props}/>;
export const DangerButton = props =>
	<ReactBootstrap.Button bsStyle="danger" {...props}/>;

// FormControl
export const FormControl = props =>
	<ReactBootstrap.FormControl {...props}/>;
// TextControl
export const TextControl = props =>
	<ReactBootstrap.FormControl type="text" {...props}/>;

// Grid, Row, Col
export const Grid = props =>
	<ReactBootstrap.Grid {...props}/>;
export const Row = props =>
	<ReactBootstrap.Row {...props}/>;
export const Col = props =>
	<ReactBootstrap.Col {...props}/>;
