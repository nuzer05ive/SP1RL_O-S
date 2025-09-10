import { PMBPayload } from '../../../../packages/core/src/pmbAssign';

export function encodePMB(payload: PMBPayload): Buffer {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, 'utf8').toString('base64');
  const prefix = Buffer.from('PNG_STUB');
  const trailer = Buffer.from('PMB:' + b64);
  return Buffer.concat([prefix, trailer]);
}
