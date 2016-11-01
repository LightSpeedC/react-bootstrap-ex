'use strict';

import React from 'react';
import {render} from 'react-dom';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import AppCenter from './app-center';

import {Button} from 'react-bootstrap';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
//import 'regenerator-runtime/runtime';
//import request from 'light-request';
//import aa from 'aa';

class MyComponent extends React.Component {
	constructor(props) {
		super(props);
		Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(p => (p.startsWith('on') || p.startsWith('handle')) &&
				typeof this[p] === 'function')
			.forEach(p => Object.defineProperty(this, p,
				{configurable: true, value: this[p].bind(this)}));
	}
}

const PrimaryButton = props =>
	<Button bsStyle="primary" {...props}/>;
const SuccessButton = props =>
	<Button bsStyle="success" {...props}/>;
const WarningButton = props =>
	<Button bsStyle="warning" {...props}/>;
const InfoButton = props =>
	<Button bsStyle="info" {...props}/>;
const DangerButton = props =>
	<Button bsStyle="danger" {...props}/>;
const TextControl = props =>
	<FormControl type="text" {...props}/>;

class App extends MyComponent {
	constructor(props) {
		super(props);
		this.state = {counter: 0, books: [], value: '', bookName: ''};
	}
	onPlus() {
		this.setState(state => ({counter: state.counter + 1}));
	}
	onMinus() {
		this.setState(state => ({counter: state.counter - 1}));
	}
	onReset() {
		this.setState({counter: 0});
	}
	componentWillMount() {
		aa(this.getBooks())
		.catch(err => console.error('getBooks:', err));
	}
	onBookAdd() {
		aa(this.postBook())
		.catch(err => console.error('postBook:', err));
	}
	*getBooks() {
		const res = yield request.get('/xyz/api/books');
		this.setState({books: res.body});
	}
	*postBook() {
		yield request.post('/xyz/api/books', {name:this.state.bookName});
		yield *this.getBooks();
		this.setState({bookName: ''});
	}
  	getValidationState() {
		const length = this.state.value.length;
		return length > 10 ? 'success':
			length > 5 ? 'warning':
			length > 0 ? 'error' : undefined;
	}
	onChangeBookName(e) {
		this.setState({bookName: e.target.value});
	}
	render() {
		return <div>
			<AppHeader />
			counter: {this.state.counter}
			<br/>
			<PrimaryButton onClick={this.onPlus} children="plus ++"/>
			<WarningButton onClick={this.onMinus} children="minus --"/>
			<InfoButton onClick={this.onReset} children="reset"/>
			<AppCenter />

			{this.state.books.map(b => <div>{b.id}: <b>{b.name}</b></div>)}
			<div>
				<TextControl placeholder="本の名前"
					onChange={this.onChangeBookName}
					value={this.state.bookName}
				/>
				<PrimaryButton onClick={this.onBookAdd}>book add</PrimaryButton>
			</div>
			<AppFooter />
		</div>;
	}
}

render(<App/>, document.getElementById('app'));
