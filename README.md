Start app from its root directory:
`npm start`

Install app from its root directory:
`npm install`

*/bin/www* is the webserver configuration, you can adjust port, ip address, enable ssl and more here.
*app.js* is the application's configuration, you may add middleware (plugins) here and adjust error pages.
*/node_modules* is where all the dependencies are installed.
*/lib* is where all the source code is located.
*/public* is where all static files are served, eg css, images and client-side javascript.
*/routes* is where you can perform logic before a page is rendered, you can pass on variables to the ejs files from there. (much like PHP, just a javascript webpage pre-processor)
*/views* is where all HTML files are located, in this case ejs files. Ejs is much like php just in javascript.
*package.json* is where all depedency information can be found with the versions we need. It is also possible to adjust the application name and version there. npm install needs to read this file in order to know what to install.

Webpage uses Twitter's bootstrap released under MIT license.
