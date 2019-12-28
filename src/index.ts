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
  PIHOLE_API_TOKEN: string;
  startTime?: number;
  endTime?: number;
}

interface IPiholeAPIQURL {
  piholeAddress: string;
  PIHOLE_API_TOKEN: string;
  startTime?: number;
  endTime?: number;
}

const createIndexTimestamp = (dateObj: Date): string =>
  `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;

const constructQuery = ({ piholeAddress, PIHOLE_API_TOKEN, startTime, endTime }: IPiholeAPIQURL): string =>
  `https://${piholeAddress}/admin/api_db.php?auth=${PIHOLE_API_TOKEN}&getAllQueries&from=${startTime}&until=${endTime}&types=1,2,3,4,5,6,7,8`;

export default async ({
  piholeAddress,
  elasticHost,
  verifySSL = false,
  PIHOLE_API_TOKEN,
  startTime = (NOW - fifteenMinutes),
  endTime = NOW
}: IPiholeMain): Promise<Response> => {
  const piholeURL = constructQuery({piholeAddress, PIHOLE_API_TOKEN, startTime, endTime });

  const res = await fetch(piholeURL, { agent: new https.Agent({ rejectUnauthorized: verifySSL }) });

  const { data } = await res.json();

  const TS = new Date(msToS(endTime));

  const tsString = createIndexTimestamp(TS);

  const piholeIndex = `pihole-logs-${tsString}`;

  const formattedData = makeNdJson(piholeIndex, data.map(formatRecord));

  const elasticsearchURL = `https://${elasticHost}/_bulk`;

  return submitToEs({ ndjsonData: formattedData, elasticsearchURL, verifySSL });
}

