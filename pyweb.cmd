pushd dist
start python -m SimpleHTTPServer 3001
start http://localhost:3001/
popd
