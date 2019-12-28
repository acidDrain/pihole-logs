import https from 'https';
import formatRecord from './formatRecord';
import fetch, { Response } from 'node-fetch';
import makeNdJson from './makeNdJson';
import { sToMs, msToS, fifteenMinutes } from './util';

const submitToEs = async ({ elasticsearchURL, ndjsonData, verifySSL }) => (

  fetch(elasticsearchURL, {
    method: 'POST',
    body: `${ndjsonData}\n`,
    headers: { 'Content-Type': 'application/x-ndjson' },
    agent: new https.Agent({ rejectUnauthorized: verifySSL })
  })

);

const NOW = sToMs(Date.now());

interface IPiholeMain {
  DEBUG?: boolean;
  piholeAddress: string;
  elasticHost: string;
  verifySSL?: boolean;
  apiToken: string;
  startTime?: number;
  endTime?: number;
}

interface IPiholeAPIQURL {
  piholeAddress: string;
  apiToken: string;
  startTime?: number;
  endTime?: number;
}

const createIndexTimestamp = (dateObj: Date): string =>
  `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;

const constructQuery = ({ piholeAddress, apiToken, startTime, endTime }: IPiholeAPIQURL): string =>
  `https://${piholeAddress}/admin/api_db.php?auth=${apiToken}&getAllQueries&from=${startTime}&until=${endTime}&types=1,2,3,4,5,6,7,8`;

export default async ({
  DEBUG = false,
  piholeAddress,
  elasticHost,
  verifySSL = false,
  apiToken,
  startTime = (NOW - fifteenMinutes),
  endTime = NOW
}: IPiholeMain): Promise<Response> => {
  const piholeURL = constructQuery({piholeAddress, apiToken, startTime, endTime });
  if (DEBUG) console.log(`piholeURL: ${piholeURL}`);

  const res = await fetch(piholeURL, { agent: new https.Agent({ rejectUnauthorized: verifySSL }) });
  const { data } = await res.json();

  if (DEBUG) console.log(`piholeResponse: ${data}`);
  if (DEBUG) console.log(`endTime: ${endTime}`);
  const TS = new Date(msToS(endTime));
  if (DEBUG) console.log(`TS: ${TS}`);
  const tsString = createIndexTimestamp(TS);
  if (DEBUG) console.log(tsString);

  const piholeIndex = `pihole-logs-${tsString}`;
  if (DEBUG) console.log(piholeIndex);

  const formattedData = makeNdJson(piholeIndex, data.map(formatRecord));
  if (DEBUG) console.log(`formattedData: ${formattedData}`);
  const elasticsearchURL = `https://${elasticHost}/_bulk`;
  if (DEBUG) console.log(`elasticsearchURL: ${elasticsearchURL}`);
  
  if (DEBUG) console.log('Submitting to ES');
  return submitToEs({ ndjsonData: formattedData, elasticsearchURL, verifySSL });
}

