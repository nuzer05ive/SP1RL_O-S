import { PMBPayload } from '../../../../packages/core/src/pmbAssign';

export function decodePMB(buf: Buffer): PMBPayload {
  const txt = buf.toString('utf8');
  const tag = 'PMB:';
  const idx = txt.lastIndexOf(tag);
  if (idx >= 0) {
    const b64 = txt.slice(idx + tag.length);
    const json = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json);
  }
  throw new Error('PMB payload not found');
}
