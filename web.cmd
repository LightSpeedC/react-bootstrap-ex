set DIST=dist
if "%PORT%" == "" set PORT=3000
start node web/web-serve-dist
start http://localhost:%PORT%/
