import fs from 'fs';
import { birthdateToNode } from '../libs/spiral-math';

const count = parseInt(process.argv[2] || '0', 10);
if (!count) {
  console.error('usage: ts-node scripts/pregen.ts <num>');
  process.exit(1);
}

if (!fs.existsSync('pregen-output')) fs.mkdirSync('pregen-output');

for (let i = 0; i < count; i++) {
  const bd = new Date(Date.now() - i * 86400000);
  const node = birthdateToNode(bd);
  fs.writeFileSync(
    `pregen-output/${bd.toISOString().substring(0,10)}.json`,
    JSON.stringify({ birthdate: bd.toISOString(), node })
  );
}
