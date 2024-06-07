const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const voice = require("./index");
module.exports = async function(req, res, url) {
  if (req.method != "GET") return;
  function rej() {
    res.statusCode = 500;
    res.end("An Error occurred");
    return true;
  }
    switch (url.pathname) {
      default: return false;
    }
}