import { Record, IRecord } from './types/record';
import { msToS } from './util';

export default (record: Record): IRecord => (
  {
    timestamp: new Date(msToS(record[0])),
    recordType: record[1],
    query: record[2],
    requestor: record[3],
    queryType: record[4]
  }
);

