#!/bin/bash
node getPiholeLogs.js
jq '.data | map(select(.requestor == "claudias-iphone.growfam.io"))[] | .timestamp + " " + .query' results.log
