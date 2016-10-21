'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

function handleClick() {
	alert('onClick triggered on the title component');
}

const AppFooter = props =>
	<footer>
		<div>
			アプリのフッタ・タイトル
		</div>
	</footer>;

export default AppFooter;
