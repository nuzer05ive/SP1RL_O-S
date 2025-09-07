import express from 'express';
import commitRouter from './commit';

const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.use('/', commitRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`api listening on ${port}`);
});
