"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _https = _interopRequireDefault(require("https"));

var _formatRecord = _interopRequireDefault(require("./formatRecord"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NOW = (0, _util.sToMs)(Date.now());

const constructQuery = ({
  piholeAddress,
  PIHOLE_API_TOKEN,
  startTime,
  endTime
}) => `https://${piholeAddress}/admin/api_db.php?auth=${PIHOLE_API_TOKEN}&getAllQueries&from=${startTime}&until=${endTime}&types=1,2,3,4,5,6,7,8`;

var _default = async ({
  piholeAddress,
  verifySSL = false,
  PIHOLE_API_TOKEN,
  startTime = NOW - _util.fifteenMinutes,
  endTime = NOW
}) => {
  const piholeURL = constructQuery({
    piholeAddress,
    PIHOLE_API_TOKEN,
    startTime,
    endTime
  });
  const res = await (0, _nodeFetch.default)(piholeURL, {
    agent: new _https.default.Agent({
      rejectUnauthorized: verifySSL
    })
  });
  const {
    data
  } = await res.json();
  return {
    data: data.map(_formatRecord.default)
  };
};

exports.default = _default;