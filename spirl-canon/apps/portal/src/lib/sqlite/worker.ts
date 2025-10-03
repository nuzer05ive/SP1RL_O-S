export type ModuleRecord = {
  id: string;
  name: string;
  description: string;
  inputs: { name: string; type: string; default?: any }[];
};

type WorkerRequest =
  | { type: 'init'; modules: ModuleRecord[] }
  | { type: 'query'; sql: string; params?: any[]; requestId: number };

type WorkerResponse = { type: 'result'; rows: ModuleRecord[]; requestId: number };

let registry: ModuleRecord[] = [];

self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === 'init') {
    registry = message.modules;
    return;
  }
  if (message.type === 'query') {
    const rows = runSql(message.sql, message.params ?? []);
    const response: WorkerResponse = { type: 'result', rows, requestId: message.requestId };
    (self as unknown as { postMessage: (msg: WorkerResponse) => void }).postMessage(response);
  }
});

function runSql(sql: string, params: any[]): ModuleRecord[] {
  const normalised = sql.trim().toLowerCase();
  if (normalised.startsWith('select') && normalised.includes('from modules')) {
    if (normalised.includes('where name like ?')) {
      const [termRaw] = params;
      const term = String(termRaw ?? '')
        .replace(/%/g, '')
        .toLowerCase();
      return registry.filter((module) =>
        module.name.toLowerCase().includes(term) || module.id.toLowerCase().includes(term)
      );
    }
    return registry;
  }
  throw new Error(`Unsupported SQL: ${sql}`);
}

export {};
