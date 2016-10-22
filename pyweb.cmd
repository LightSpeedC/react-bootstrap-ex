if "%PORT%" == "" set PORT=3000
pushd dist
start python -m SimpleHTTPServer %PORT%
start http://localhost:%PORT%/
popd
