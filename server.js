const http = require("http");
const renderer = require("./static/page");
const url = require("url");
const fs = require("fs");

const functions = [renderer];

module.exports = http
  .createServer(async (req, res) => {
    try {
      const parsedUrl = url.parse(req.url, true);
      //if (!parsedUrl.path.endsWith('/')) parsedUrl.path += '/';
      const found = await renderer(req, res, parsedUrl);
      console.log(req.method, parsedUrl.path);
      setTimeout(() => {
        if (!found) {
          res.statusCode = 404;
          res.end(fs.readFileSync("./views/404.html"));
        }
      },500)

    } catch (x) {
      res.statusCode = 502;
      res.end(`Internal Server Error Occured: ${x}`);
    }
  })
  .listen(443, console.log);
