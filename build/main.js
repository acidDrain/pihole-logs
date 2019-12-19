"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _https = _interopRequireDefault(require("https"));

var _formatRecord = _interopRequireDefault(require("./formatRecord"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _makeNdJson = _interopRequireDefault(require("./makeNdJson"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

try {
  const {
    PIHOLE_ADDRESS,
    API_TOKEN,
    START_TIME,
    END_TIME
  } = process.env;
  const NOW = Date.now();
  const TS = new Date(NOW);
  const VERIFY_SSL = false;
  const INDEX_TIMESTAMP = `${TS.getFullYear()}-${TS.getMonth() + 1}-${TS.getDate()};`;
  const PIHOLE_URL = `https://${PIHOLE_ADDRESS}/admin/api_db.php?auth=${API_TOKEN}&getAllQueries&from=${START_TIME}.000&until=${END_TIME}.000&types=1,2,3,4,5,6,7,8`;
  const elasticsearchURL = `https://elasticsearch.ued.lan/pihole-logs-${INDEX_TIMESTAMP}/_bulk`;
  console.error(`PIHOLE_URL: ${PIHOLE_URL}`);

  (async () => {
    const res = await (0, _nodeFetch.default)(PIHOLE_URL, {
      agent: new _https.default.Agent({
        rejectUnauthorized: VERIFY_SSL
      })
    });
    const {
      data
    } = await res.json();
    const formattedData = (0, _makeNdJson.default)(data.map(_formatRecord.default));
    console.log(`Formatted Data: ${formattedData}`);
    const esResponse = await (0, _nodeFetch.default)(elasticsearchURL, {
      method: 'POST',
      body: `${formattedData}\n`,
      headers: {
        'Content-Type': 'application/x-ndjson'
      },
      agent: new _https.default.Agent({
        rejectUnauthorized: VERIFY_SSL
      })
    });
    const esResponseJson = await esResponse.json();
    console.log(`Elastic Response: ${JSON.stringify(esResponseJson)}`);
  })();
} catch (e) {
  console.error(`Error: No PIHOLE_ADDRESS and/or API_TOKEN were provided!\n${e}`);
  process.exit(1);
}