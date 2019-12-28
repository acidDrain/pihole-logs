import { IRecord } from './types/record';

export default (esIndex: string, jsonArray: IRecord[]): string => (
  jsonArray.map(jsonRecord => [JSON.stringify({create: { "_index": esIndex } }), JSON.stringify(jsonRecord)]).map(i => i.join('\n')).join('\n')
);

