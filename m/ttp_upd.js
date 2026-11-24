const ID = '__ID__', KIND = '__KIND__';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setVal = (el, v) => { const p = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('blur', { bubbles: true })); };
for (let t = 0; t < 30 && !document.querySelector('#listing-title-input'); t++) await sleep(500);
await sleep(1500);
const T = await (await fetch('__BASE__tmap.json')).json();
const log = [];
setVal(document.querySelector('#listing-title-input'), T[ID][KIND]);
if (KIND === 'phys') setVal(document.querySelector('#listing-quantity-input'), '20');
const more = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Show all attributes'); if (more) { more.click(); await sleep(1000); }
const grp = lbl => { const i = [...document.querySelectorAll('input[id^=typeahead-input]')].find(i => (document.querySelector(`label[for="${i.id}"]`)?.innerText || '').startsWith(lbl)); if (!i) return []; let g = i; for (let k = 0; k < 6; k++) { g = g.parentElement; if (g.querySelector('input[id^=typeahead-option]')) break; } return [...g.querySelectorAll('input[id^=typeahead-option]')]; };
const tick = (lbl, names) => { let n = 0; for (const c of grp(lbl)) { if (names.includes(c.parentElement.textContent.trim()) && !c.checked) { c.click(); n++; } } return n; };
log.push('subj ' + tick('Subject', ['Animal', 'Pet portrait']));
log.push('room ' + tick('Room', ['Living room', 'Bedroom', 'Office', 'Entryway']));
if (KIND === 'phys') log.push('mat ' + tick('Materials', ['Paper']));
const selBy = (lbl, val) => { const s = [...document.querySelectorAll('select')].find(s => { let g = s; for (let i = 0; i < 4; i++) g = g.parentElement; return (g.querySelector('label,legend')?.innerText || '').trim().startsWith(lbl); }); if (s) { const o = [...s.options].find(o => o.text === val); if (o) setVal(s, o.value); return s.options[s.selectedIndex].text; } return 'none'; };
log.push('orient ' + selBy('Orientation', 'Vertical'));
log.push('pieces ' + selBy('Number of pieces', '1'));
await sleep(800);
const ok = document.querySelector('#listing-title-input').value === T[ID][KIND] && (KIND !== 'phys' || document.querySelector('#listing-quantity-input').value === '20');
log.push('ok ' + ok);
localStorage.setItem('ttp_u', JSON.stringify({ ID, KIND, log, t: Date.now() }));
if (ok) { const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Save draft' || b.innerText.trim() === 'Save as draft'); if (b) { b.click(); log.push('saved'); } else log.push('NO SAVE BTN'); }
localStorage.setItem('ttp_u', JSON.stringify({ ID, KIND, log, t: Date.now() }));
return log;
