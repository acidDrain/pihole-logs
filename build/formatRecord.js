"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

var _default = record => ({
  timestamp: new Date((0, _util.msToS)(record[0])),
  recordType: record[1],
  query: record[2],
  requestor: record[3],
  queryType: record[4]
});

exports.default = _default;