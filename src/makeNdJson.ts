import { IRecord } from './types/record';

export default (jsonArray: IRecord[]): string => (
  jsonArray.map(jsonRecord => [JSON.stringify({create: {}}), JSON.stringify(jsonRecord)]).map(i => i.join('\n')).join('\n')
);

