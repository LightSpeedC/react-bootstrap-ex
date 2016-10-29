set DIST=dist
if "%PORT%" == "" set PORT=3000
if "%HOT_RELOAD_PORT%" == "" set HOT_RELOAD_PORT=3080
start http://localhost:%PORT%/
node web/web-serve-dist-hot-reload
if "%paused%" == "" pause & set paused=paused
