export type Record = [number, string, string, string, number];

export interface IRecord {
  timestamp: Date;
  recordType: string;
  requestor: string;
  queryType: number;
  query: string;
};

