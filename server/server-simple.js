'use strict';

const express = require('express');
const app = express();
const serveIndex = require('serve-index');

app.use(express.static(process.env.DIST || '.'));
app.use(serveIndex(process.env.DIST || '.', {icons: true}));
app.listen(process.env.PORT || 3000);
