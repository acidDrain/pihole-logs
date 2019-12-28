# PiHole Logs

Retrieve logs from PiHole's REST API and submit to Elastic Search.

## Getting Started

Set an environment variable `PIHOLE_API_TOKEN` to the API TOKEN from PiHole. This can be done by creating a file called .env and adding the line

```shell
PIHOLE_API_TOKEN=tokengoeshere
```

or by setting it via the environment

```shell
export PIHOLE_API_TOKEN=tokengoeshere
```

Then, after installing or downloading this library, you can create a simple file called `runme.js` with the following contents:

```javascript
const pihole = require('./build').default;
require('dotenv').config();

const NOW = Date.now() / 1000;

const piholeAddress = "raspberrypi.lan"; // Replace with actual pihole address
const elasticHost = "elasticsearch.lan"; // Replace with actual elasticsearch addres
const verifySSL = false;
const endTime = NOW;
const startTime = NOW - 900;

const reqData = {
  DEBUG: true,
  startTime,
  piholeAddress,
  endTime,
  apiToken: process.env.apiToken,
  elasticHost,
  verifySSL,
};

(async () => {
  console.log('Making async request');
  const result = await pihole(reqData);
  console.log(`Finished await, result: ${JSON.stringify(result)}`);
  return result;
})().then(r => console.log(`Received response: ${JSON.stringify(r)}`)).catch(console.log);
```

