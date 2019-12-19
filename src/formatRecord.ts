import { Record, IRecord } from './types/record';

export default (record: Record): IRecord => (
  {
    timestamp: new Date(record[0]*1000),
    recordType: record[1],
    query: record[2],
    requestor: record[3],
    queryType: record[4]
  }
);

