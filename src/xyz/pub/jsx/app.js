'use strict';

import React from 'react';
import {render} from 'react-dom';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import AppCenter from './app-center';

//import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
//import 'regenerator-runtime/runtime';
//import request from 'light-request';
//import aa from 'aa';

import * as My from '../../../lib';

class MyCounter extends My.Component {
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
			<My.PrimaryButton bsSize="small" onClick={this.onPlus} children="plus ++"/>
			<My.WarningButton bsSize="small" onClick={this.onMinus} children="minus --"/>
			<My.InfoButton bsSize="small" onClick={this.onReset} children="reset"/>
			<br/>
			<My.PrimaryButton bsSize="small" onClick={() => this.setState(s => ({counter: s.counter + 1}))} children="plus ++"/>
			<My.WarningButton bsSize="small" onClick={() => this.setState(s => ({counter: s.counter - 1}))} children="minus --"/>
			<My.InfoButton bsSize="small" onClick={() => this.setState({counter: 0})} children="reset"/>
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

class App extends My.Component {
	constructor(props) {
		super(props);
		this.state = {books: [], bookName: ''};
	}
	componentWillMount() {
		aa(this.getBooks())(e => e && console.error('getBooks:', e));
	}
	onBookAdd() {
		aa(this.postBook())(e => e && console.error('postBook:', e));
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
			<My.Grid>
				<My.Row>
					<My.Col xs={12} md={2} style={{backgroundColor:'#ffe'}}>
						<a href="/xyz/pub/">xyz</a>
						<br/>
						<a href="/ex01-react-intro-js/">ex01-react-intro-js</a>
						<br/>
						<a href="/ex02-react-intro-jsx/">ex02-react-intro-jsx</a>
						<br/>
						<a href="/ex11-react-bootstrap-jsx/">ex11-react-bootstrap-jsx</a>
						<br/>
						menu<br/>
						menu<br/>
						menu<br/>
					</My.Col>
					<My.Col xs={12} md={10}>
						<My.Row style={{backgroundColor:'#eff'}}>
							<My.Col xs={12} md={4} style={{backgroundColor:'#eef'}}>
								<MyCounter/>
							</My.Col>
							<My.Col xs={12} md={8}>
								<AppCenter/>
							</My.Col>
							<My.Col xs={12} md={12} style={{backgroundColor:'#efe'}}>
								<Books list={this.state.books}/>
							</My.Col>
						</My.Row>
						<My.Row style={{backgroundColor:'#fee'}}>
							<My.Col xs={12} md={12}>
								<My.TextControl placeholder="本の名前"
									onChange={this.onChangeBookName}
									value={this.state.bookName}
								/>
								<My.PrimaryButton onClick={this.onBookAdd}>book add</My.PrimaryButton>
							</My.Col>
						</My.Row>
					</My.Col>
				</My.Row>
			</My.Grid>

			<AppFooter />
		</div>;
	}
}

render(<App/>, document.getElementById('app'));
