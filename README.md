# cdncik is a little cdn

Reads given files, minifies and keeps it in memory.

```js
var cdn = cdnApp({
    port: 1337,
    path: __dirname + "/static/"
});

cdn.addJs({ path: "js/main.js", maxAge: 25000 }, { path: "js/functions.js", maxAge: 0 });
cdn.addCss({ path: "css/main.css", maxAge: 25000 });
cdn.start();
```

for handling the load, i used [Cluster Module](https://nodejs.org/dist/latest-v6.x/docs/api/cluster.html).

todo:
	- reload scenerio
