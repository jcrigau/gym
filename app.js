:root { --bg:#f3f4f6; --card:#ffffff; --text:#111827; --muted:#6b7280; --line:#e5e7eb; --primary:#111827; --danger:#b91c1c; }
* { box-sizing:border-box; }
body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; background:var(--bg); color:var(--text); }
header { background:var(--primary); color:white; padding:24px 18px 18px; border-radius:0 0 22px 22px; }
h1 { margin:0; font-size:28px; }
header p { margin:6px 0 0; color:#d1d5db; }
main { padding:14px; max-width:720px; margin:auto; }
.tabs { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
.tab, button { border:0; border-radius:14px; padding:13px 12px; font-size:16px; font-weight:700; background:#e5e7eb; color:#111827; }
.tab.active, button[type="submit"] { background:var(--primary); color:white; }
.panel { display:none; }
.panel.active { display:block; }
form, .card { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:14px; box-shadow:0 2px 10px rgba(0,0,0,.04); }
label { display:block; font-weight:700; margin:0 0 12px; }
input, textarea, select { width:100%; margin-top:6px; border:1px solid #d1d5db; border-radius:12px; padding:12px; font-size:17px; background:white; color:var(--text); }
textarea { resize:vertical; }
.row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.pesoBox { display:flex; align-items:center; gap:8px; }
.pesoBox input { flex:1; }
.pesoBox span { font-weight:800; color:var(--muted); }
button { width:100%; margin-top:8px; }
.secondary { background:#fff; border:1px solid #d1d5db; color:#111827; }
.hidden { display:none; }
.toolbar { display:grid; grid-template-columns:1fr 110px; gap:8px; align-items:center; margin-bottom:12px; }
.toolbar input { margin:0; }
.toolbar button { margin:0; }
.cards { display:flex; flex-direction:column; gap:10px; }
.card h3 { margin:0 0 4px; font-size:19px; }
.meta { color:var(--muted); margin:0 0 8px; }
.stats { display:flex; flex-wrap:wrap; gap:8px; margin:8px 0; }
.badge { background:#f3f4f6; border:1px solid var(--line); padding:7px 9px; border-radius:999px; font-weight:700; }
.actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.actions button { margin:0; padding:10px; }
.delete { color:white; background:var(--danger); }
.empty { text-align:center; color:var(--muted); background:white; border-radius:16px; padding:18px; border:1px dashed #d1d5db; }
footer { text-align:center; color:var(--muted); padding:18px; }
