import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/plan', (_req, res) => {
  res.json({ path: ['red','blue'], tStar: 0 });
});

app.post('/sticker', (req, res) => {
  const data = req.body;
  const file = path.join(process.cwd(), 'stickers.json');
  const arr = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : [];
  arr.push(data);
  fs.writeFileSync(file, JSON.stringify(arr));
  res.json({ ok: true });
});

app.post('/api/metabodies', (_req, res) => {
  res.json({ id: 'meta-1' });
});

app.post('/api/metabodies/:id/sticker', (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 8799;
app.listen(port, () => {
  console.log('api listening on', port);
});
