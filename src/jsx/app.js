'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// Needed for onTouchTap http://stackoverflow.com/a/34015469/988941
require('react-tap-event-plugin')();

import AppHeader from './app-header';
import AppFooter from './app-footer';
import AppCenter from './app-center';
import {Button, ButtonToolbar} from 'react-bootstrap';

const MyAwesomeReactComponent = props =>
	<div>
		<AppHeader />
		<AppCenter />
		<p>test p</p>
  <ButtonToolbar>
    {/* Standard button */}
    <Button>Default</Button>

    {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
    <Button bsStyle="primary">Primary</Button>

    {/* Indicates a successful or positive action */}
    <Button bsStyle="success">Success</Button>

    {/* Contextual button for informational alert messages */}
    <Button bsStyle="info">Info</Button>

    {/* Indicates caution should be taken with this action */}
    <Button bsStyle="warning">Warning</Button>

    {/* Indicates a dangerous or potentially negative action */}
    <Button bsStyle="danger">Danger</Button>

    {/* Deemphasize a button by making it look like a link while maintaining button behavior */}
    <Button bsStyle="link">Link</Button>
  </ButtonToolbar>
		<AppFooter />
	</div>;

const App = props =>
	<MyAwesomeReactComponent />;

ReactDOM.render(<App />, document.getElementById('app'));
