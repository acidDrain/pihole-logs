const https = require('https');
const fetch = require('node-fetch');
require('dotenv').config();

const formatRecord = record => (
  {
    timestamp: record[0],
    recordType: record[1],
    query: record[2],
    requestor: record[3],
    queryType: record[4]
  }
);

/*
 * const toNDJSON = () => ();
 *
 * const writeToES = (data) => {
 * };
 */

try {  
  const { PIHOLE_ADDRESS, API_TOKEN, START_TIME, END_TIME } = process.env;
  const NOW = Date.now();
  const TS = new Date();
  const VERIFY_SSL = false;
  const INDEX_TIMESTAMP = `${TS.getFullYear()}-${TS.getMonth() + 1}-${TS.getDate()};`
  const PIHOLE_URL = `https://${PIHOLE_ADDRESS}/admin/api_db.php?auth=${API_TOKEN}&getAllQueries&from=${START_TIME}.000&until=${END_TIME}.000&types=1,2,3,4,5,6,7,8`;

  console.log(`PIHOLE_URL: ${PIHOLE_URL}`);
  fetch(PIHOLE_URL, { agent: new https.Agent({ rejectUnauthorized: VERIFY_SSL }) })
    .then(res => res.json())
    .then(({ data }) => data.map(d => console.log(formatRecord(d))))
    .catch(err => console.log(`Error fetching logs: ${err}`));

} catch (e) {
  console.error(`Error: No PIHOLE_ADDRESS and/or API_TOKEN were provided!\n${e}`);
  process.exit(1);
}

