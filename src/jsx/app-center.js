'use strict';

import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

function handleClick() {
	alert('onClick triggered on the title component');
}

const AppCenter = props =>
		<ButtonToolbar>
			<Button>Default</Button>
			<Button bsStyle="primary" onClick={handleClick}>Primary</Button>
			<Button bsStyle="success">Success</Button>
			<Button bsStyle="info">Info</Button>
			<Button bsStyle="warning">Warning</Button>
			<Button bsStyle="danger">Danger</Button>
			<Button bsStyle="link">Link</Button>
		</ButtonToolbar>;

export default AppCenter;
