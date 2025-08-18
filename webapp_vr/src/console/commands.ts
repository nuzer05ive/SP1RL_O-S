import { useGhostConsole, GhostConsoleState, TickLogEntry } from './state';

export type Command = Record<string, any> & { cmd: string };

export function dispatch(cmd: Command): { ok: boolean; data?: any; error?: string } {
  const state = useGhostConsole.getState();
  switch (cmd.cmd) {
    case 'seed.set':
      useGhostConsole.setState({ inputs: { ...state.inputs, seedText: cmd.text } });
      return { ok: true };
    case 'antonyms.set':
      useGhostConsole.setState({ inputs: { ...state.inputs, antonyms: (cmd.pairs || []).map(([key, _ant, value]: [string,string,number]) => ({ key, value })) } });
      return { ok: true };
    case 'zcm.override':
      if (cmd.enable) {
        useGhostConsole.setState({ zcm: cmd.value });
      }
      return { ok: true };
    case 'stress.set':
      useGhostConsole.setState({ inputs: { ...state.inputs, stress: { entropy: cmd.entropy, novelty: cmd.novelty, urgency: cmd.urgency } } });
      return { ok: true };
    case 'wobble.scale':
      useGhostConsole.setState({ wobble: { ...state.wobble, scale: cmd.value } });
      return { ok: true };
    case 'plan.next': {
      const angle = state.wobble.angle + 0.000437 * state.wobble.scale;
      return { ok: true, data: { angle } };
    }
    case 'fire': {
      const angle = state.wobble.angle + 0.000437 * state.wobble.scale;
      const t = state.log.length + 1;
      const entry: TickLogEntry = {
        t,
        angle,
        address: state.lastAddress || '',
        zcm: state.zcm,
        teal: state.teal.score,
        witness: state.witness.arm,
        epoch: state.epoch.index,
        sealed: state.epoch.sealed
      };
      useGhostConsole.setState({
        wobble: { ...state.wobble, angle, step: t },
        log: [...state.log, entry]
      });
      return { ok: true, data: entry };
    }
    case 'witness.rotation':
      useGhostConsole.setState({ witness: { ...state.witness, rotationEnabled: cmd.enable } });
      return { ok: true };
    case 'witness.allow':
      useGhostConsole.setState({ witness: { ...state.witness, allowed: new Set(cmd.arms) } });
      return { ok: true };
    case 'sarcasm.mode':
      useGhostConsole.setState({ policy: { ...state.policy, sarcasm: { mode: cmd.value, perMinute: cmd.perMinute ?? state.policy.sarcasm.perMinute } } });
      return { ok: true };
    case 'teal.thresholds':
      useGhostConsole.setState({ teal: { ...state.teal, soft: cmd.soft, hard: cmd.hard } });
      return { ok: true };
    case 'zcm2math':
      useGhostConsole.setState({ policy: { ...state.policy, zcmToMath: { p: cmd.p, alpha_b: cmd.alpha_b, alpha_o: cmd.alpha_o, autoTighten: cmd.autoTighten } } });
      return { ok: true };
    case 'epoch.seal':
      if (state.teal.score >= state.teal.hard && state.witness.arm === 5) {
        useGhostConsole.setState({ epoch: { ...state.epoch, sealed: true } });
        return { ok: true };
      }
      return { ok: false, error: 'gated' };
    case 'export.json':
      return { ok: true, data: JSON.stringify(state) };
    case 'import.json':
      useGhostConsole.setState(cmd.payload as GhostConsoleState);
      return { ok: true };
    default:
      return { ok: false, error: 'unknown command' };
  }
}
