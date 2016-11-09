'use strict';

import React from 'react';
import {render} from 'react-dom';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import AppCenter from './app-center';

import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
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
				<button onClick={()=> props.onClick && props.onClick(b)}>x</button> {b.id}: <b>{b.name}</b>
			</div>
		)}
	</div>;

const SIZE = 10;

class App extends My.Component {
	constructor(props) {
		super(props);
		this.state = {books: [], bookName: '', page: 1, length: 0};
	}
	componentWillMount() {
		aa(this.getBooks(1))
			(err => err && console.error('getBooks:', err));
	}
	onBookAdd() {
		aa(this.postBook({name: this.state.bookName}))
			(err => err && console.error('postBook:', err));
	}
	onBookRemove(book) {
		aa(this.removeBook(book))
			(err => err && console.error('postBook:', err));
	}
	handleSelect(page) {
		aa(this.getBooks(page))
			(err => err && console.error('getBooks:', err));
	}
	onChangeBookName(event) {
		this.setState({bookName: event.target.value});
	}
	*getBooks(page) {
		const res = yield request.get('/xyz/api/books?size=' + SIZE + '&offset=' + (page - 1) * SIZE);
		this.setState({books: res.body.result, length: res.body.length, page});
	}
	*postBook(book) {
		const res = yield request.post('/xyz/api/books', book);
		const page = Math.floor((res.body.length + SIZE - 1) / SIZE);
		this.setState({bookName: ''});
		yield *this.getBooks(page);
	}
	*removeBook(book) {
		const res = yield request.delete('/xyz/api/books/' + book.id);
		const page = Math.min(this.state.page, Math.floor((res.body.length + SIZE - 1) / SIZE));
		yield *this.getBooks(page);
	}
	render() {
		return <div>
			<AppHeader/>
			<My.Grid>
				<My.Row>
					<My.Col xs={12} md={2} style={{backgroundColor:'#ffe'}}>

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
		</Navbar.Collapse>

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

page:{this.state.page} length:{this.state.length}<br/>

      <ReactBootstrap.Pagination
        prev next first last
        ellipsis boundaryLinks
        items={Math.floor((this.state.length + SIZE - 1) / SIZE)}
        maxButtons={5}
        activePage={this.state.page}
        onSelect={this.handleSelect} />

								<Books list={this.state.books} onClick={this.onBookRemove}/>

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
