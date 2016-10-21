'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// Needed for onTouchTap http://stackoverflow.com/a/34015469/988941
require('react-tap-event-plugin')();

import AppHeader from './app-header';
import AppFooter from './app-footer';

const MyAwesomeReactComponent = props =>
	<div>
		<AppHeader />
		<p>test p</p>
		<AppFooter />
	</div>;

const App = props =>
	<MyAwesomeReactComponent />;

ReactDOM.render(<App />, document.getElementById('app'));
