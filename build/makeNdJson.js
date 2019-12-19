"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = jsonArray => jsonArray.map(jsonRecord => [JSON.stringify({
  create: {}
}), JSON.stringify(jsonRecord)]).map(i => i.join('\n')).join('\n');

exports.default = _default;