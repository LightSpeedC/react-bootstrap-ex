'use strict';

import React from 'react';

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
