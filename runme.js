const pihole = require('./build').default;
require('dotenv').config();

const reqData = {
  DEBUG: true,
  startTime: process.env.startTime,
  piholeAddress: process.env.piholeAddress,
  endTime: process.env.endTime,
  apiToken: process.env.apiToken,
  elasticHost: process.env.elasticHost,
  verifySSL: false,
};

(async () => {
  console.log('Making async request');
  const result = await pihole(reqData);
  console.log(`Finished await, result: ${JSON.stringify(result)}`);
  return result;
})().then(r => console.log(`Received response: ${JSON.stringify(r)}`)).catch(console.log);

