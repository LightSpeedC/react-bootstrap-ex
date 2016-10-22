'use strict';

import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import aa from 'aa';

class AppCenter extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {n: 0};
	}
	handleClick() {
		let self = this;
		self.setState({n: self.state.n + 1});
		aa(function *() {
			yield cb => setTimeout(cb, 1000);
			self.setState({n: self.state.n + 1});
			//alert('onClick triggered on the title component');
		});
	}
	render() {
		return (
			<ButtonToolbar>
				<Button>Default</Button>
				<Button bsStyle="primary" onClick={this.handleClick}>Primary {this.state.n}</Button>
				<Button bsStyle="success">Success</Button>
				<Button bsStyle="info">Info</Button>
				<Button bsStyle="warning">Warning</Button>
				<Button bsStyle="danger">Danger</Button>
				<Button bsStyle="link">Link</Button>
			</ButtonToolbar>
		);
	}
}

export default AppCenter;
