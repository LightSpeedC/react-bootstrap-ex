'use strict';

import React from 'react';

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
