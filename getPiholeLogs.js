const fs = require('fs');
const pihole = require('./build').default;


pihole({ piholeAddress: 'eye.growfam.io', PIHOLE_API_TOKEN: '5e8b621a2360a22c2689621b565b91257ca6fcc2f2f29b733bd8664c982247ad' })
  .then(d => fs.writeFile('./results.log', JSON.stringify(d), () => console.log('Wrote file')))
  .catch(console.error);
