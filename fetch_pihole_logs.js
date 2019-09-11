/*
 * .env file with API token
 *
 * NOTE: Use seconds vs Milliseconds
 * 1. Check for previous timestamp, otherwise use now
 * 2. from=previous timestamp || now - 15 minutes, to = now
 * 3. write current timestamp
 * 4. fetch logs from pihole API
 * pihole API url: `https://${PIHOLE_ADDRESS}/admin/api_db.php?auth=${TOKEN}&getAllQueries&from=1562132822.501&until=1562651222.501&types=1,2,3,4,5,6,7,8
 * 5. ES index = pihole-todays date
 * 6. write to elasticsearch API
 *
 *
 */
/*
 * .data[]
 * [timestamp, recordType, payload, requestor, queryType]
 * example recordType: A, AAAA, PTR, etc.
 * example queryType: 2, 2, 3
 */
