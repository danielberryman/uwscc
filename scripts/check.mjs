// Checks a running server against the site's promises.
// Usage: BASE=http://127.0.0.1:3001 node scripts/check.mjs [--server path/to/server.js]
// Exits 1 if any check fails.
const BASE = process.env.BASE || 'http://127.0.0.1:3001';

const TRIAL = 'https://stan.store/danielberryman/p/uwscc--15-hours-1-workshop-copy';
const JANUARY = 'https://stan.store/danielberryman/p/1hour-group-class';

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

const get = async (p) => {
  const r = await fetch(BASE + p);
  return { status: r.status, text: await r.text() };
};

const home = await get('/');
check('home page loads', home.status === 200, `status ${home.status}`);

// Private files in the project folder must never be served.
for (const p of ['/email_list.csv', '/server.js', '/package.json', '/.gitignore']) {
  const r = await get(p);
  check(`${p} is not served`, r.status === 404, `status ${r.status}`);
}

const html = home.text;
check('trial link present', html.includes(TRIAL));
check('January link present', html.includes(JANUARY));
for (const bad of ['venmo', 'zelle', 'herokuapp', '$140', 'Co-Director', 'Grace Morgan<']) {
  check(`no "${bad}"`, !html.toLowerCase().includes(bad.toLowerCase()));
}
check('contact email', html.includes('info@uwschildrenschoir.com'));

for (const img of [...html.matchAll(/(?:src=|url\()"?(img\/[^")]+)/g)].map((m) => m[1])) {
  const r = await fetch(`${BASE}/${img}`);
  check(`image ${img}`, r.status === 200, `status ${r.status}`);
}

for (const r of results) console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.ok ? '' : ` (${r.detail})`}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
