const ONLINE = process.env.RUN_ONLINE === '1';
(ONLINE ? describe : describe.skip)('chat braid', () => {
  const { parseTranscript, scoreChunk, hingeOneLiner } = require('../packages/core/src');

  it('parses a full chunk', () => {
    const lines = [
      '[iN/host] Start here',
      '[oN/user] Reply one',
      '[oNYiN/host] Small example',
      '[YaNg/user] Aha!',
      '[YiN] Done',
    ];
    const chunks = parseTranscript(lines);
    expect(chunks.length).toBe(1);
    expect(chunks[0].closure).toBe(true);
    expect(chunks[0].turns.length).toBe(5);
  });

  it('scores deterministically', () => {
    const pc = {
      id: 'pc',
      participants: ['host', 'user'],
      closure: true,
      turns: [
        { tag: 'iN', role: 'host', surface: 'teach the trick', full: 'teach the trick' },
        { tag: 'oN', role: 'user', surface: 'confused about trick', full: 'confused about trick' },
        { tag: 'oNYiN', role: 'host', surface: 'tiny example', full: 'tiny example' },
        { tag: 'YaNg', role: 'user', surface: 'aha', full: 'aha' },
        { tag: 'YiN', role: 'host', surface: 'wrap', full: 'wrap' },
      ],
    };
    const s = scoreChunk(pc).scores!;
    expect(s.coherence).toBeGreaterThan(0);
    expect(s.leastAction).toBeLessThan(1);
    const line = hingeOneLiner('host speaks truth', 'user learns trick');
    expect(typeof line).toBe('string');
    expect(line.length).toBeGreaterThan(10);
  });
});
