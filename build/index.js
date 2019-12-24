"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _https = _interopRequireDefault(require("https"));

var _formatRecord = _interopRequireDefault(require("./formatRecord"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _makeNdJson = _interopRequireDefault(require("./makeNdJson"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submitToEs = async ({
  elasticsearchURL,
  ndjsonData,
  verifySSL
}) => (0, _nodeFetch.default)(elasticsearchURL, {
  method: 'POST',
  body: `${ndjsonData}\n`,
  headers: {
    'Content-Type': 'application/x-ndjson'
  },
  agent: new _https.default.Agent({
    rejectUnauthorized: verifySSL
  })
});

const NOW = (0, _util.sToMs)(Date.now());

const createIndexTimestamp = dateObj => `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;

const constructQuery = ({
  piholeAddress,
  apiToken,
  startTime,
  endTime
}) => `https://${piholeAddress}/admin/api_db.php?auth=${apiToken}&getAllQueries&from=${startTime}&until=${endTime}&types=1,2,3,4,5,6,7,8`;

var _default = async ({
  DEBUG = false,
  piholeAddress,
  elasticHost,
  verifySSL = false,
  apiToken,
  startTime = NOW - _util.fifteenMinutes,
  endTime = NOW
}) => {
  const piholeURL = constructQuery({
    piholeAddress,
    apiToken,
    startTime,
    endTime
  });
  if (DEBUG) console.log(`piholeURL: ${piholeURL}`);
  const res = await (0, _nodeFetch.default)(piholeURL, {
    agent: new _https.default.Agent({
      rejectUnauthorized: verifySSL
    })
  });
  const {
    data
  } = await res.json();
  if (DEBUG) console.log(`piholeResponse: ${data}`);
  const formattedData = (0, _makeNdJson.default)(data.map(_formatRecord.default));
  if (DEBUG) console.log(`formattedData: ${formattedData}`);
  if (DEBUG) console.log(`endTime: ${endTime}`);
  const TS = new Date((0, _util.msToS)(endTime));
  if (DEBUG) console.log(`TS: ${TS}`);
  const tsString = createIndexTimestamp(TS);
  if (DEBUG) console.log(tsString);
  const elasticsearchURL = `https://${elasticHost}/pihole-logs-${tsString}/_bulk`;
  if (DEBUG) console.log(`elasticsearchURL: ${elasticsearchURL}`);
  if (DEBUG) console.log('Submitting to ES');
  return submitToEs({
    ndjsonData: formattedData,
    elasticsearchURL,
    verifySSL
  });
};

exports.default = _default;