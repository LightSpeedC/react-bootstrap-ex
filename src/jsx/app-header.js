'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

function handleClick() {
	alert('onClick triggered on the title component');
}

const AppHeader = props =>
	<header>
		<div>
			アプリのヘッダ・タイトル
		</div>
	</header>;

export default AppHeader;
