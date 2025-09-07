import express from 'express';
import commitRouter from './commit';
import sceneRouter from './scene';
import hdpcRouter from './hdpc';
import zenavaRouter from './zenava';

const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.use('/', commitRouter);
app.use('/', sceneRouter);
app.use('/', hdpcRouter);
app.use('/', zenavaRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`api listening on ${port}`);
});
