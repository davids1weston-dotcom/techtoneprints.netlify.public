const ID = '__ID__';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setVal = (el, v) => { const p = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('blur', { bubbles: true })); };
for (let t = 0; t < 30 && !document.querySelector('#listing-title-input'); t++) await sleep(500);
await sleep(1500);
const T = await (await fetch('https://raw.githubusercontent.com/davids1weston-dotcom/techtoneprints.netlify.public/b7953dcb5afc473139d6009aa3033b54c022337d/m/tmap.json')).json();
const log = [];
// title, description, quantity
setVal(document.querySelector('#listing-title-input'), T[ID].phys);
const de = document.querySelector('#listing-description-textarea');
setVal(de, de.value.replace('dispatched within 5 to 7 working days', 'dispatched within 3 to 5 working days'));
setVal(document.querySelector('#listing-quantity-input'), '20');
// prices
const P = ID.includes('-gilded-') ? { P: ['22.00', '27.00', '34.00'], F: ['39.95', '44.95', '56.95'] } : { P: ['19.85', '24.85', '30.00'], F: ['29.95', '34.95', '45.95'] };
const ins = [...document.querySelectorAll('input[name^="variations.tables.0.rows"][name$="price"]')];
ins.forEach((i, k) => { const f = Math.floor(k / 3), s = k % 3; setVal(i, (f < 2 ? P.P : P.F)[s]); });
log.push('prices ' + ins.map(i => i.value).join(','));
// attributes
const more = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Show all attributes'); if (more) { more.click(); await sleep(1000); }
const grp = lbl => { const i = [...document.querySelectorAll('input[id^=typeahead-input]')].find(i => (document.querySelector(`label[for="${i.id}"]`)?.innerText || '').startsWith(lbl)); if (!i) return []; let g = i; for (let k = 0; k < 6; k++) { g = g.parentElement; if (g.querySelector('input[id^=typeahead-option]')) break; } return [...g.querySelectorAll('input[id^=typeahead-option]')]; };
const tick = (lbl, names) => { let n = 0; for (const c of grp(lbl)) { if (names.includes(c.parentElement.textContent.trim())) { if (!c.checked) c.click(); n++; } } return n; };
log.push('subj ' + tick('Subject', ['Animal', 'Pet portrait']));
log.push('room ' + tick('Room', ['Living room', 'Bedroom', 'Office', 'Entryway']));
log.push('mat ' + tick('Materials', ['Paper']));
const selBy = (lbl, val) => { const s = [...document.querySelectorAll('select')].find(s => { let g = s; for (let i = 0; i < 4; i++) g = g.parentElement; return (g.querySelector('label,legend')?.innerText || '').trim().startsWith(lbl); }); if (s) { const o = [...s.options].find(o => o.text === val); if (o) setVal(s, o.value); return s.options[s.selectedIndex].text; } return 'none'; };
log.push('orient ' + selBy('Orientation', 'Vertical'));
log.push('pieces ' + selBy('Number of pieces', '1'));
// returns policy
if (!/14 days/.test((document.body.innerText.match(/Returns and exchanges \n[\s\S]{0,120}/) || [''])[0])) {
  const cp = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Change policy' && b.offsetParent); if (cp) { cp.click(); await sleep(1200); }
  const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === '14 days' && e.offsetParent);
  if (el) { let p = el; for (let i = 0; i < 8; i++) { p = p.parentElement; if (p.querySelector('button')) break; } const b = p.querySelector('button'); if (b && /Apply/.test(b.innerText)) b.click(); await sleep(1200); }
}
const ret = (document.body.innerText.match(/Returns and exchanges \n[\s\S]{0,120}/) || [''])[0];
log.push('returns14 ' + /14 days/.test(ret));
await sleep(800);
const ok = document.querySelector('#listing-title-input').value === T[ID].phys && document.querySelector('#listing-quantity-input').value === '20' && ins.length === 12 && /14 days/.test(ret) && de.value.includes('3 to 5 working days');
log.push('ok ' + ok);
if (ok) { const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Save draft' || b.innerText.trim() === 'Save as draft'); if (b) { b.click(); log.push('saved'); } else log.push('NO SAVE BTN'); }
localStorage.setItem('ttp_u', JSON.stringify({ ID, log, t: Date.now() }));
return log;
