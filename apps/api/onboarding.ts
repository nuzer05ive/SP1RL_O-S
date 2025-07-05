import data from '../../data/onboarding_221.json' assert { type: 'json' };

export default () =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
