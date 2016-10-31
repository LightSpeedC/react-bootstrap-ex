'use strict';

import React from 'react';
//const React = require('react');
import {render} from 'react-dom';
import 'regenerator-runtime/runtime';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import AppCenter from './app-center';

import {Button} from 'react-bootstrap';

class OurComponent extends React.Component {
	constructor(props) {
		super(props);
		if (this.state === undefined) this.state = {};
		console.log('My1:', Object.getOwnPropertyNames(this));
		console.log('My2:', Object.getOwnPropertyNames(this.constructor.prototype));
		Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(p => p.startsWith('on') || p.startsWith('handle'))
			.forEach(p => Object.defineProperty(this, p,
				{configurable: true, value: this[p].bind(this)}));
	}
}

class App extends OurComponent {
	constructor(props) {
		super(props);
		console.log('App1:', Object.getOwnPropertyNames(this));
		console.log('App2:', Object.getOwnPropertyNames(this.constructor.prototype));
		this.state = {counter: 0};
		//this.onClick = this.onClick.bind(this);
	}
	onPlus() {
		//this.setState({counter: this.state.counter + 1});
		this.setState(state => ({counter: state.counter + 1}));
	}
	onMinus() {
		this.setState(state => ({counter: state.counter - 1}));
	}
	onReset() {
		this.setState(state => ({counter: 0}));
	}
	render() {
		return <div>
			counter: {this.state.counter}
			<br/>
			<Button bsStyle="primary" onClick={this.onPlus}>plus ++</Button>
			<Button bsStyle="warning" onClick={this.onMinus}>minus --</Button>
			<Button bsStyle="info" onClick={this.onReset}>reset</Button>
			<AppHeader />
			<AppCenter />
			<p>test p1</p>
			{this.props.children}
			<AppFooter />
		</div>;
	}
}

render(<App>hello world</App>, document.getElementById('app'));
