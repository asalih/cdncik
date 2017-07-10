const http = require("http");
const fs = require("fs");
const minify = require("minify")
const path = require("path");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var files = {};
module.exports = function (options) {
    this.server = {};
    this.start = function () {
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
        } else {
            console.log("listening" + process.pid)
            server = http.createServer(this.onRequest);
            server.listen(options.port);
        }
    };
    this.onRequest = function (req, res) {
        var file = req.url.split("?")[0];
        if (file) file = file.replace(/\\/gi, "/");
        if (file[0] == "/") file = file.slice(1)

        var content = files[file];
        if (content) {
            res.writeHeader(200, {
                "content-type": content.type, "cache-control": "public, max-age=" + content.maxAge, "pid": process.pid
            });

            res.write(content.body);
            res.end();
        }
        else {
            res.statusCode = 404;
            res.write("not found.");
            res.end();
        }
    };
    this.addJs = function () {
        for (var i = 0; i < arguments.length; i++) {
            addFile(arguments[i], minify.js, "application/javascript; charset=utf-8")
        }
    };
    this.addCss = function () {
        for (var i = 0; i < arguments.length; i++) {
            addFile(arguments[i], minify.css, "text/css; charset=utf-8")
        }
    };
    this.addFile = function (item, minifier, type) {
        var fileName = item.path;
        var maxAge = item.maxAge;
        let dir = options.static;
        fs.readFile(path.join(dir, fileName), "utf8", (err, data) => {
            minifier(data, (merr, min) => {
                files[fileName] = { body: min, type: type, maxAge: maxAge };
            });
        });
    }

    return this;

}