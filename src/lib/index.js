'use strict';

import React from 'react';
import {Button, FormControl} from 'react-bootstrap';

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

export const PrimaryButton = props =>
	<Button bsStyle="primary" {...props}/>;
export const SuccessButton = props =>
	<Button bsStyle="success" {...props}/>;
export const WarningButton = props =>
	<Button bsStyle="warning" {...props}/>;
export const InfoButton = props =>
	<Button bsStyle="info" {...props}/>;
export const DangerButton = props =>
	<Button bsStyle="danger" {...props}/>;
export const TextControl = props =>
	<FormControl type="text" {...props}/>;
