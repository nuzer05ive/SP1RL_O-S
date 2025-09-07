import { useState } from 'react';

export default function HDPC() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState({ moral: '', dilemma: '', stakes: '' });
  const [design, setDesign] = useState({ hats: ['straw', 'silk'], humane: true });
  const [trials, setTrials] = useState<any[]>([]);
  const [result, setResult] = useState<any | null>(null);

  async function submitIntent() {
    await fetch('/hdpc/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...intent, scene_id: 's1' }),
    });
    setStep(1);
  }

  async function submitDesign() {
    const payload = {
      scene_id: 's1',
      hats: design.hats,
      constraints: {
        humane: design.humane,
        moral: intent.moral,
        dilemma: intent.dilemma,
        stakes: intent.stakes,
      },
    };
    await fetch('/hdpc/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setStep(2);
  }

  async function submitTrials() {
    const payload = {
      scene_id: 's1',
      hats: [
        { name: design.hats[0], pass: true },
        { name: design.hats[1], pass: false },
      ],
    };
    await fetch('/hdpc/trials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setTrials(payload.hats);
    setStep(3);
  }

  async function finalize() {
    const payload = {
      scene_id: 's1',
      constraints: {
        humane: design.humane,
        moral: intent.moral,
        dilemma: intent.dilemma,
        stakes: intent.stakes,
      },
      hats: trials,
    };
    const res = await fetch('/hdpc/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setResult(await res.json());
    setStep(4);
  }

  return (
    <div>
      <h1>HDPC Wizard</h1>
      {step === 0 && (
        <div>
          <h2>Intent</h2>
          <input
            placeholder="moral"
            value={intent.moral}
            onChange={(e) => setIntent({ ...intent, moral: e.target.value })}
          />
          <input
            placeholder="dilemma"
            value={intent.dilemma}
            onChange={(e) => setIntent({ ...intent, dilemma: e.target.value })}
          />
          <input
            placeholder="stakes"
            value={intent.stakes}
            onChange={(e) => setIntent({ ...intent, stakes: e.target.value })}
          />
          <button onClick={submitIntent}>Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2>Design</h2>
          <label>
            <input
              type="checkbox"
              checked={design.humane}
              onChange={(e) => setDesign({ ...design, humane: e.target.checked })}
            />
            humane
          </label>
          <button onClick={submitDesign}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Trials</h2>
          <button onClick={submitTrials}>Run Trials</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Finalize</h2>
          <button onClick={finalize}>Finalize</button>
        </div>
      )}
      {step === 4 && result && (
        <div>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
