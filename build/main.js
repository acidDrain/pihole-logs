"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _https = _interopRequireDefault(require("https"));

var _formatRecord = _interopRequireDefault(require("./formatRecord"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _makeNdJson = _interopRequireDefault(require("./makeNdJson"));

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

const NOW = Date.now();
const TS = new Date(NOW);

var _default = async ({
  piholeAddress,
  elasticHost,
  verifySSL = false,
  apiToken,
  startTime = NOW / 1000 - 60 * 15,
  endTime = NOW
}) => {
  const INDEX_TIMESTAMP = `${TS.getFullYear()}-${TS.getMonth() + 1}-${TS.getDate()};`;
  const piholeURL = `https://${piholeAddress}/admin/api_db.php?auth=${apiToken}&getAllQueries&from=${startTime}.000&until=${endTime}.000&types=1,2,3,4,5,6,7,8`;
  const elasticsearchURL = `https://${elasticHost}/pihole-logs-${INDEX_TIMESTAMP}/_bulk`;
  const res = await (0, _nodeFetch.default)(piholeURL, {
    agent: new _https.default.Agent({
      rejectUnauthorized: verifySSL
    })
  });
  const {
    data
  } = await res.json();
  const formattedData = (0, _makeNdJson.default)(data.map(_formatRecord.default));
  return submitToEs({
    ndjsonData: formattedData,
    elasticsearchURL,
    verifySSL: false
  });
};

exports.default = _default;