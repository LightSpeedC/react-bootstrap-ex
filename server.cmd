@set DIST=dist
@rem if "%PORT%" == "" set PORT=3000
@if "%PORT%" == "" call :set_port
@if "%HOT_RELOAD_PORT%" == "" set HOT_RELOAD_PORT=3080
@start http://localhost:%PORT%/
node server/server
@if "%paused%" == "" pause & set paused=paused
@goto end
@:set_port
@node web/random-port > x.bat
@call x.bat
@del x.bat
@:end
