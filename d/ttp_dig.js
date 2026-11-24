const ID = '__ID__';
const base = 'https://raw.githubusercontent.com/davids1weston-dotcom/techtoneprints.netlify.public/57c346ffc4d27ca9f8d1b5151a648fdfad9d905e/d/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setVal = (el, v) => { const p = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('blur', { bubbles: true })); };
const fi = () => document.querySelector('#media input[type=file]') || document.querySelector('input[type=file]');
const drop = fs => { const i = fi(); const dt = new DataTransfer(); fs.forEach(f => dt.items.add(f)); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); };
const log = [];
for (let t = 0; t < 30 && !document.querySelector('#listing-title-input'); t++) await sleep(500);
await sleep(1000);
const L = (await (await fetch(base + 'dmap.json')).json())[ID];
const del = [...document.querySelectorAll('#media button')].find(b => b.innerText.trim() === 'Delete all');
if (del) { del.click(); await sleep(800); const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d => d.offsetParent && d.innerText.includes('Delete all photos')); if (d) [...d.querySelectorAll('button')].find(b => b.innerText.trim() === 'Delete all').click(); await sleep(1500); }
const files = []; for (let i = 1; i <= 6; i++) { const n = `${ID}-${String(i).padStart(2, '0')}.jpg`; files.push(new File([await (await fetch(base + ID + '/' + n)).blob()], n, { type: 'image/jpeg' })); }
drop(files); for (let t = 0; t < 40; t++) { await sleep(1000); if (document.querySelectorAll('#media img').length >= 6) break; } await sleep(2000);
drop([new File([await (await fetch(base + ID + '/' + ID + '-video.mp4')).blob()], ID + '-video.mp4', { type: 'video/mp4' })]);
for (let t = 0; t < 40; t++) { await sleep(1000); if (document.querySelectorAll('#media video').length >= 1) break; } await sleep(3000);
log.push('media ' + document.querySelectorAll('#media img').length + '/' + document.querySelectorAll('#media video').length);
setVal(document.querySelector('#listing-title-input'), L.title);
setVal(document.querySelector('#listing-description-textarea'), L.description);
const ti = document.querySelector('#listing-tags-input'); let tp = ti; for (let i = 0; i < 6; i++) tp = tp.parentElement;
for (const b of [...tp.querySelectorAll('button')].filter(b => /^Delete tag/.test(b.getAttribute('aria-label') || ''))) { b.click(); await sleep(100); }
await sleep(400);
for (const t of L.tags) { setVal(ti, t); await sleep(120); ti.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true })); await sleep(220); }
await sleep(500);
const tagsNow = [...tp.querySelectorAll('button')].filter(b => /^Delete tag/.test(b.getAttribute('aria-label') || '')).map(b => b.getAttribute('aria-label').replace('Delete tag ', ''));
log.push('tags ' + (JSON.stringify(tagsNow) === JSON.stringify(L.tags)));
setVal(document.querySelector('#listing-price-input'), L.price);
setVal(document.querySelector('#listing-quantity-input'), '999');
const R = (n, l) => { const r = [...document.querySelectorAll(`input[name=${n}]`)].find(x => x.labels[0] && x.labels[0].innerText.includes(l)); if (r && !r.checked) r.click(); };
R('whoMade', 'I did'); R('isSupply', 'A finished product');
{ const wm = document.querySelector('#when-made-select'); if (wm) setVal(wm, 'made_to_order'); }
const ss = document.querySelector('#shop-section-select'); setVal(ss, [...ss.options].find(o => o.text.trim() === L.section).value);
const more = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Show all attributes'); if (more) { more.click(); await sleep(1000); }
const grp = lbl => { const i = [...document.querySelectorAll('input[id^=typeahead-input]')].find(i => (document.querySelector(`label[for="${i.id}"]`)?.innerText || '').startsWith(lbl)); if (!i) return []; let g = i; for (let k = 0; k < 6; k++) { g = g.parentElement; if (g.querySelector('input[id^=typeahead-option]')) break; } return [...g.querySelectorAll('input[id^=typeahead-option]')]; };
const tick = (lbl, names) => { let n = 0; for (const c of grp(lbl)) { if (names.includes(c.parentElement.textContent.trim())) { if (!c.checked) c.click(); n++; } } return n; };
log.push('subj ' + tick('Subject', ['Animal', 'Pet portrait']) + ' room ' + tick('Room', ['Living room', 'Bedroom', 'Office', 'Entryway']));
const selBy = (lbl, val) => { const s = [...document.querySelectorAll('select')].find(s => { let g = s; for (let i = 0; i < 4; i++) g = g.parentElement; return (g.querySelector('label,legend')?.innerText || '').trim().startsWith(lbl); }); if (s) { const o = [...s.options].find(o => o.text === val); if (o) setVal(s, o.value); return s.options[s.selectedIndex].text; } return 'none'; };
log.push('orient ' + selBy('Orientation', 'Vertical') + ' pieces ' + selBy('Number of pieces', '1'));
const digital = /What type of item is it\? \nDigital/.test(document.body.innerText);
log.push('digital ' + digital);
await sleep(800);
const ok = digital && document.querySelectorAll('#media img').length >= 6 && document.querySelectorAll('#media video').length >= 1 && log[1] === 'tags true' && document.querySelector('#listing-title-input').value === L.title && document.querySelector('#listing-price-input').value === L.price;
log.push('ok ' + ok);
localStorage.setItem('ttp_dl', JSON.stringify({ ID, log, t: Date.now() }));
if (ok) { const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Save as draft' || b.innerText.trim() === 'Save draft'); if (b) b.click(); }
return log;
