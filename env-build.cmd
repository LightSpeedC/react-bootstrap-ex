rem *** npm ***
call npm init -y

rem *** typescript ***
call npm i typescript@2.0.6 -g
call npm i typescript@2.0.6 -D
if not exist tsconfig.json call tsc --init

rem *** eslint ***
call npm i eslint -g
call npm i eslint eslint-plugin-react -D
if not exist .eslintrc.js eslint --init
call npm i -D @types/node

@rem call yarn add --dev react react-dom react-router react-tap-event-plugin babel-preset-es2015 babel-preset-react babelify browserify literalify gulp run-sequence gulp-rename gulp-plumber gulp-uglify react-bootstrap react-tap-event-plugin vinyl-source-stream minimatch@^3 graceful-fs@^4
cd server && call yarn && cd ..
yarn && gulp clean && start gulp && server
pause
