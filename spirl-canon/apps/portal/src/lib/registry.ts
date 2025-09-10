export type Module = { id: string; name: string };
const modules: Module[] = [{ id: 'mod1', name: 'Module One' }];
export function listModules() {
  return modules;
}
