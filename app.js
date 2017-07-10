'use strict';

var cdnApp = require("./cdn");

// init app
var cdn = cdnApp({
    port: 1337,
    static: __dirname + "/static/"
});

// add js files. it'll read file and minify it.
// maxAge is using for cache-control response header.
cdn.addJs({ path: "js/main.js", maxAge: 60 }, { path: "js/functions.js", maxAge: 0 });
cdn.addCss({ path: "css/main.css", maxAge: 1200 });

// start http server
cdn.start();

