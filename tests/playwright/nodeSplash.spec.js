const { test, expect } = require('@playwright/test');

test('STClock renders time', async ({ page }) => {
  await page.setContent('<div id="app"></div>');
  await page.addScriptTag({content:`
    const el = document.createElement('div');
    el.id='clock';
    document.getElementById('app').appendChild(el);
    el.innerText = new Date().toLocaleTimeString();
  `});
  const text = await page.textContent('#clock');
  expect(text).not.toBe('');
});
