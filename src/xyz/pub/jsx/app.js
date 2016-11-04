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

import {MyComponent, TextControl,
	PrimaryButton, SuccessButton, WarningButton, InfoButton, DangerButton
} from '../../../lib';

class MyCounter extends MyComponent {
	constructor(props) {
		super(props);
		this.state = {counter: 0};
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
	render() {
		return <div>
			counter: {this.state.counter}
			<br/>
			<PrimaryButton onClick={this.onPlus} children="plus ++"/>
			<WarningButton onClick={this.onMinus} children="minus --"/>
			<InfoButton onClick={this.onReset} children="reset"/>
		</div>;
	}
}

const Books = props =>
	<div>
		{props.list.map(b =>
			<div>
				{b.id}: <b>{b.name}</b>
			</div>
		)}
	</div>;

class App extends MyComponent {
	constructor(props) {
		super(props);
		this.state = {books: [], bookName: ''};
	}
	componentWillMount() {
		aa(this.getBooks())
		.catch(err => console.error('getBooks:', err));
	}
	onBookAdd() {
		aa(this.postBook())
		.catch(err => console.error('postBook:', err));
	}
	onChangeBookName(e) {
		this.setState({bookName: e.target.value});
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
	render() {
		return <div>
			<AppHeader/>
			<MyCounter/>
			<AppCenter/>

			<Books list={this.state.books}/>
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
