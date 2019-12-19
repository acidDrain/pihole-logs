import https from 'https';
import formatRecord from './formatRecord';
import fetch, { Response } from 'node-fetch';
import makeNdJson from './makeNdJson';

const submitToEs = async ({ elasticsearchURL, ndjsonData, verifySSL }) => (

  fetch(elasticsearchURL, {
    method: 'POST',
    body: `${ndjsonData}\n`,
    headers: { 'Content-Type': 'application/x-ndjson' },
    agent: new https.Agent({ rejectUnauthorized: verifySSL })
  })

);


const NOW = Date.now();
const TS = new Date(NOW);

interface IPiholeMain {
  piholeAddress: string;
  elasticHost: string;
  verifySSL?: boolean;
  apiToken: string;
  startTime?: number;
  endTime?: number;
}

export default async ({ piholeAddress, elasticHost, verifySSL = false, apiToken, startTime = (NOW / 1000 - (60*15)), endTime = NOW }: IPiholeMain): Promise<Response> => {
  const INDEX_TIMESTAMP = `${TS.getFullYear()}-${TS.getMonth() + 1}-${TS.getDate()};`
  const piholeURL = `https://${piholeAddress}/admin/api_db.php?auth=${apiToken}&getAllQueries&from=${startTime}.000&until=${endTime}.000&types=1,2,3,4,5,6,7,8`;
    const elasticsearchURL = `https://${elasticHost}/pihole-logs-${INDEX_TIMESTAMP}/_bulk`;

    const res = await fetch(piholeURL, { agent: new https.Agent({ rejectUnauthorized: verifySSL }) });
  const { data } = await res.json();
  const formattedData = makeNdJson(data.map(formatRecord));
  return submitToEs({ ndjsonData: formattedData, elasticsearchURL, verifySSL: false });
}

