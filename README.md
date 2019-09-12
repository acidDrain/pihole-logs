# PiHole Logs

Retrieve logs from PiHole's REST API and submit to Elastic Search.

.env file with API token

NOTE: Use seconds vs Milliseconds
1. Check for previous timestamp, otherwise use now
2. from=previous timestamp || now - 15 minutes, to = now
3. write current timestamp
4. fetch logs from pihole API
pihole API url: `https://${PIHOLE_ADDRESS}/admin/api_db.php?auth=${TOKEN}&getAllQueries&from=1562132822.501&until=1562651222.501&types=1,2,3,4,5,6,7,8`
5. ES index = pihole-todays date
6. write to elasticsearch API




```json
{
"data":[  
  [
    "timestamp": 1562132822,
    "recordType": "A",
    "query": "strict.bing.com",
    "requestor": "deatherstar.lan",
    "queryType": 2
  ]
  ]
  }
```
