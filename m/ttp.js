const ID = '__ID__';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const base = 'https://raw.githubusercontent.com/davids1weston-dotcom/techtoneprints.netlify.public/etsy-mockups/m/';
const setVal = (el, v) => { const p = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('blur', { bubbles: true })); };
const drop = files => { const i = document.querySelector('input[type=file]'); const dt = new DataTransfer(); files.forEach(f => dt.items.add(f)); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); };
const log = [];
for (let t = 0; t < 30 && !document.querySelector('#listing-title-input'); t++) await sleep(500);
const data = await (await fetch(base + 'lmap.json')).json();
const L = data[ID];
if (!L) throw new Error('no data ' + ID);
// media
const del = [...document.querySelectorAll('#media button')].find(b => b.innerText.trim() === 'Delete all');
if (del) { del.click(); await sleep(800); const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d => d.offsetParent && d.innerText.includes('Delete all photos')); [...d.querySelectorAll('button')].find(b => b.innerText.trim() === 'Delete all').click(); await sleep(1500); }
const files = [];
for (let i = 1; i <= 10; i++) { const n = `${ID}-${String(i).padStart(2, '0')}.jpg`; const b = await (await fetch(base + ID + '/' + n)).blob(); files.push(new File([b], n, { type: 'image/jpeg' })); }
drop(files);
for (let t = 0; t < 60; t++) { await sleep(1000); if (document.querySelectorAll('#media img').length >= 10 && !document.querySelector('#media [class*=spinner], #media [class*=loading]')) break; }
await sleep(2000);
const v = await (await fetch(base + ID + '/' + ID + '-video.mp4')).blob();
drop([new File([v], ID + '-video.mp4', { type: 'video/mp4' })]);
for (let t = 0; t < 60; t++) { await sleep(1000); if (document.querySelectorAll('#media video').length >= 1) break; }
await sleep(3000);
log.push('media ' + document.querySelectorAll('#media img').length + '/' + document.querySelectorAll('#media video').length);
// text
setVal(document.querySelector('#listing-title-input'), L.title);
setVal(document.querySelector('#listing-description-textarea'), L.description);
// tags
const ti = document.querySelector('#listing-tags-input'); let tp = ti; for (let i = 0; i < 6; i++) tp = tp.parentElement;
const dAll = [...tp.querySelectorAll('button')].find(b => b.innerText.trim() === 'Delete all');
if (dAll) { dAll.click(); await sleep(800); const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d => d.offsetParent && /tag/i.test(d.innerText)); if (d) { const b = [...d.querySelectorAll('button')].find(b => /delete/i.test(b.innerText)); if (b) b.click(); await sleep(800); } }
for (const [k, b] of [...tp.querySelectorAll('button')].filter(b => /^Delete tag/.test(b.getAttribute('aria-label') || '')).entries()) { b.click(); await sleep(100); }
await sleep(500);
for (const t of L.tags) { setVal(ti, t); await sleep(120); ti.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true })); await sleep(220); }
await sleep(600);
const tagsNow = [...tp.querySelectorAll('button')].filter(b => /^Delete tag/.test(b.getAttribute('aria-label') || '')).map(b => b.getAttribute('aria-label').replace('Delete tag ', ''));
log.push('tags ' + tagsNow.length + ' ok=' + (JSON.stringify(tagsNow) === JSON.stringify(L.tags)));
// section
const ss = document.querySelector('#shop-section-select'); const opt = [...ss.options].find(o => o.text.trim() === L.section); setVal(ss, opt.value);
// prices
const tier = ID.includes('-gilded-') ? 'gilded' : 'standard';
const P = { standard: { P: ['12.95', '14.95', '18.95'], F: ['29.95', '39.95', '49.95'] }, gilded: { P: ['16.95', '18.95', '23.95'], F: ['49.95', '59.95', '69.95'] } }[tier];
const ins = [...document.querySelectorAll('input[name^="variations.tables.0.rows"][name$="price"]')];
ins.forEach((i, k) => { const f = Math.floor(k / 3), s = k % 3; setVal(i, (f < 2 ? P.P : P.F)[s]); });
log.push('prices ' + ins.map(i => i.value).join(','));
log.push('title ' + document.querySelector('#listing-title-input').value.slice(0, 45) + ' | sec ' + ss.options[ss.selectedIndex].text + ' | desc ' + document.querySelector('#listing-description-textarea').value.length);
const ok = document.querySelectorAll('#media img').length >= 11 && document.querySelectorAll('#media video').length >= 1 && log[1].endsWith('ok=true') && ins.length === 12 && document.querySelector('#listing-title-input').value === L.title;
log.push('ok ' + ok);
localStorage.setItem('ttp_last', JSON.stringify({ id: ID, log, t: Date.now() }));
if (ok) { [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Save as draft').click(); }
return log;
