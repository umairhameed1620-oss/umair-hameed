import { useState } from "react";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f1117; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1a1d27; }
  ::-webkit-scrollbar-thumb { background: #2d6a4f; border-radius: 3px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(45,106,79,.5); } 50%{ box-shadow: 0 0 0 8px rgba(45,106,79,0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn .4s ease forwards; }
  .nav-item:hover { background: rgba(45,106,79,.15) !important; color: #52b788 !important; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.4) !important; }
  .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .row-hover:hover { background: rgba(45,106,79,.06) !important; }
  .input-field:focus { border-color: #2d6a4f !important; outline: none; box-shadow: 0 0 0 3px rgba(45,106,79,.2); }
  .tab:hover { color: #52b788 !important; }
`;
document.head.appendChild(style);

// ── seed data ─────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => `£${Number(n).toFixed(2)}`;

const INIT_PRODUCTS = [
  { id: "p1", barcode: "8901234567890", name: "Basmati Rice 5kg",    category: "Grains",   buyPrice: 8.50,  sellPrice: 12.99, stock: 40, alert: 10 },
  { id: "p2", barcode: "5012345678901", name: "Olive Oil 1L",         category: "Cooking",  buyPrice: 4.20,  sellPrice: 6.99,  stock: 25, alert: 8  },
  { id: "p3", barcode: "4011200296908", name: "Whole Milk 2L",        category: "Dairy",    buyPrice: 1.10,  sellPrice: 1.89,  stock: 4,  alert: 15 },
  { id: "p4", barcode: "0123456789012", name: "Cheddar Cheese 400g",  category: "Dairy",    buyPrice: 2.80,  sellPrice: 4.49,  stock: 18, alert: 10 },
  { id: "p5", barcode: "7350053850008", name: "Orange Juice 1L",      category: "Drinks",   buyPrice: 1.60,  sellPrice: 2.79,  stock: 0,  alert: 12 },
  { id: "p6", barcode: "5000112637922", name: "Cornflakes 500g",      category: "Cereals",  buyPrice: 1.30,  sellPrice: 2.25,  stock: 33, alert: 10 },
  { id: "p7", barcode: "5010133402946", name: "Digestive Biscuits",   category: "Snacks",   buyPrice: 0.90,  sellPrice: 1.65,  stock: 50, alert: 15 },
  { id: "p8", barcode: "5000347008138", name: "White Bread 800g",     category: "Bakery",   buyPrice: 0.75,  sellPrice: 1.29,  stock: 7,  alert: 10 },
];

const INIT_SALES = [
  { id: uid(), date: "2026-03-05", barcode: "8901234567890", name: "Basmati Rice 5kg",   qty: 5,  buyPrice: 8.50,  sellPrice: 12.99 },
  { id: uid(), date: "2026-03-06", barcode: "4011200296908", name: "Whole Milk 2L",      qty: 18, buyPrice: 1.10,  sellPrice: 1.89  },
  { id: uid(), date: "2026-03-07", barcode: "5012345678901", name: "Olive Oil 1L",       qty: 8,  buyPrice: 4.20,  sellPrice: 6.99  },
  { id: uid(), date: "2026-03-08", barcode: "7350053850008", name: "Orange Juice 1L",    qty: 30, buyPrice: 1.60,  sellPrice: 2.79  },
  { id: uid(), date: "2026-03-10", barcode: "0123456789012", name: "Cheddar Cheese 400g",qty: 12, buyPrice: 2.80,  sellPrice: 4.49  },
  { id: uid(), date: "2026-03-11", barcode: "5000112637922", name: "Cornflakes 500g",    qty: 22, buyPrice: 1.30,  sellPrice: 2.25  },
  { id: uid(), date: "2026-03-12", barcode: "5000347008138", name: "White Bread 800g",   qty: 38, buyPrice: 0.75,  sellPrice: 1.29  },
];

const INIT_STOCK_IN = [
  { id: uid(), date: "2026-03-01", barcode: "8901234567890", name: "Basmati Rice 5kg",   qty: 40, unitCost: 8.50,  total: 340.00 },
  { id: uid(), date: "2026-03-01", barcode: "5012345678901", name: "Olive Oil 1L",       qty: 25, unitCost: 4.20,  total: 105.00 },
  { id: uid(), date: "2026-03-02", barcode: "4011200296908", name: "Whole Milk 2L",      qty: 60, unitCost: 1.10,  total: 66.00  },
  { id: uid(), date: "2026-03-03", barcode: "0123456789012", name: "Cheddar Cheese 400g",qty: 20, unitCost: 2.80,  total: 56.00  },
];

// ── colors ────────────────────────────────────────────────────────────────
const C = {
  bg:     "#0f1117",
  panel:  "#161922",
  card:   "#1c2030",
  border: "#252a3a",
  text:   "#e2e8f0",
  muted:  "#64748b",
  green:  "#2d6a4f",
  greenL: "#52b788",
  red:    "#ef4444",
  amber:  "#f59e0b",
  blue:   "#3b82f6",
  indigo: "#6366f1",
  cyan:   "#06b6d4",
};

// ── helpers ───────────────────────────────────────────────────────────────
const T = {
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, transition: "all .25s" },
  th:   { padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}` },
  td:   { padding: "13px 16px", borderBottom: `1px solid #1a1f2e`, fontSize: 13 },
  badge:(c) => ({ background: c + "22", color: c, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-block" }),
  btn:  (bg, fg = "#fff") => ({ background: bg, color: fg, border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all .2s" }),
  input:{ background: "#0d1018", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 13, fontFamily: "inherit", width: "100%", transition: "all .2s" },
  label:{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, display: "block", letterSpacing: .5 },
};

// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab,      setTab]      = useState("dashboard");
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [sales,    setSales]    = useState(INIT_SALES);
  const [stockIn,  setStockIn]  = useState(INIT_STOCK_IN);
  const [month,    setMonth]    = useState("2026-03");
  const [toast,    setToast]    = useState(null);

  const notify = (msg, col = C.greenL) => {
    setToast({ msg, col });
    setTimeout(() => setToast(null), 3000);
  };

  const TABS = [
    { key: "dashboard", icon: "📊", label: "Dashboard"      },
    { key: "receive",   icon: "📥", label: "Receive Stock"  },
    { key: "sales",     icon: "💳", label: "Record Sale"    },
    { key: "inventory", icon: "📦", label: "Inventory"      },
    { key: "reports",   icon: "📈", label: "P&L Reports"    },
    { key: "customers", icon: "📞", label: "Customer Caller ID" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, background: toast.col, color: "#fff", padding: "13px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,.5)", animation: "fadeIn .3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 230, background: C.panel, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "0 0 20px", position: "sticky", top: 0, height: "100vh" }}>

        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -1 }}>
            🛒 AisleMart
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>
            OWNER DASHBOARD
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 2, padding: "8px 12px", textTransform: "uppercase" }}>Main Menu</div>
          {TABS.map(t => (
            <div key={t.key} className="nav-item"
              onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 2, color: tab === t.key ? C.greenL : C.muted, background: tab === t.key ? "rgba(45,106,79,.15)" : "transparent", fontWeight: tab === t.key ? 700 : 400, fontSize: 14, borderRight: tab === t.key ? `3px solid ${C.greenL}` : "3px solid transparent", transition: "all .15s" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </div>
          ))}
        </nav>

        {/* Store status */}
        <div style={{ margin: "0 10px" }}>
          <div style={{ background: "#0d1f15", border: "1px solid #1a3a22", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: C.greenL, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>STORE STATUS</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>🟢 Open</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* Topbar */}
        <header style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", alignItems: "center", gap: 14, height: 58, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
            {TABS.find(t => t.key === tab)?.icon} {TABS.find(t => t.key === tab)?.label}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.muted }}>
            {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div style={{ ...T.badge(C.greenL), fontSize: 12 }}>Manager</div>
          <div style={{ ...T.badge(products.filter(p => p.stock <= p.alert).length > 0 ? C.amber : C.greenL), fontSize: 12 }}>
            {products.filter(p => p.stock <= p.alert).length > 0
              ? `⚠️ ${products.filter(p => p.stock <= p.alert).length} Low Stock`
              : "✅ Stock OK"}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28 }} className="fade-in">
          {tab === "dashboard" && <Dashboard  products={products} sales={sales} stockIn={stockIn} month={month} setMonth={setMonth} />}
          {tab === "receive"   && <ReceiveStock products={products} setProducts={setProducts} stockIn={stockIn} setStockIn={setStockIn} notify={notify} />}
          {tab === "sales"     && <RecordSale  products={products} setProducts={setProducts} sales={sales} setSales={setSales} notify={notify} />}
          {tab === "inventory" && <Inventory   products={products} setProducts={setProducts} notify={notify} />}
          {tab === "reports"   && <Reports     products={products} sales={sales} stockIn={stockIn} month={month} setMonth={setMonth} />}
          {tab === "customers" && <CustomerCallerID />}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
function Dashboard({ products, sales, stockIn, month, setMonth }) {
  const ms      = sales.filter(s => s.date.startsWith(month));
  const rev     = ms.reduce((a, s) => a + s.sellPrice * s.qty, 0);
  const cogs    = ms.reduce((a, s) => a + s.buyPrice  * s.qty, 0);
  const profit  = rev - cogs;
  const spent   = stockIn.filter(s => s.date.startsWith(month)).reduce((a, s) => a + s.total, 0);
  const lowStock= products.filter(p => p.stock > 0 && p.stock <= p.alert);
  const outStock= products.filter(p => p.stock === 0);

  const topSellers = Object.values(
    ms.reduce((acc, s) => {
      if (!acc[s.barcode]) acc[s.barcode] = { name: s.name, qty: 0, revenue: 0 };
      acc[s.barcode].qty     += s.qty;
      acc[s.barcode].revenue += s.sellPrice * s.qty;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const monthName = new Date(month + "-15").toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Store Overview</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{monthName}</p>
        </div>
        <div style={{ flex: 1 }} />
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          style={{ ...T.input, width: "auto", fontFamily: "'JetBrains Mono',monospace" }}
          className="input-field" />
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue",   value: fmt(rev),    color: C.blue,   icon: "💰", sub: `${ms.length} sales` },
          { label: "Cost of Goods",   value: fmt(cogs),   color: C.amber,  icon: "📦", sub: `${fmt(spent)} on stock` },
          { label: profit >= 0 ? "Gross Profit" : "Net Loss", value: fmt(Math.abs(profit)), color: profit >= 0 ? C.greenL : C.red, icon: profit >= 0 ? "✅" : "❌", sub: `${rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0}% margin` },
          { label: "Stock Alerts",    value: lowStock.length + outStock.length, color: C.amber, icon: "⚠️", sub: `${outStock.length} out of stock` },
        ].map(k => (
          <div key={k.label} className="card" style={{ ...T.card, padding: 20, borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{k.icon} {k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Top sellers */}
        <div style={{ ...T.card, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>🏆 Top Selling Products</div>
          {topSellers.length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No sales this month yet.</p>
            : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>
                  {["Product", "Units", "Revenue", "Profit/Unit"].map(h => <th key={h} style={T.th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {topSellers.map((s, i) => {
                    const p = products.find(pr => pr.name === s.name);
                    return (
                      <tr key={i} className="row-hover">
                        <td style={{ ...T.td, fontWeight: 700 }}>{s.name}</td>
                        <td style={T.td}>{s.qty}</td>
                        <td style={{ ...T.td, color: C.blue, fontWeight: 700 }}>{fmt(s.revenue)}</td>
                        <td style={T.td}><span style={T.badge(C.greenL)}>{fmt(p ? p.sellPrice - p.buyPrice : 0)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>

        {/* Stock alerts */}
        <div style={{ ...T.card, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>⚠️ Stock Alerts</div>
          {lowStock.length === 0 && outStock.length === 0
            ? <div style={{ color: C.greenL, fontWeight: 700, fontSize: 14 }}>✅ All products well stocked</div>
            : [...outStock, ...lowStock].map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{p.barcode}</div>
                </div>
                <span style={T.badge(p.stock === 0 ? C.red : C.amber)}>
                  {p.stock === 0 ? "OUT OF STOCK" : `${p.stock} left`}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RECEIVE STOCK
// ══════════════════════════════════════════════════════════════════════════
function ReceiveStock({ products, setProducts, stockIn, setStockIn, notify }) {
  const [barcode, setBarcode] = useState("");
  const [found,   setFound]   = useState(null);
  const [form,    setForm]    = useState({ name: "", category: "", buyPrice: "", sellPrice: "", qty: "", alert: "10" });

  const DEMOS = {
    "8901234567890": { name: "Basmati Rice 5kg",   category: "Grains",  buyPrice: 8.50,  sellPrice: 12.99 },
    "5012345678901": { name: "Olive Oil 1L",        category: "Cooking", buyPrice: 4.20,  sellPrice: 6.99  },
    "4011200296908": { name: "Whole Milk 2L",       category: "Dairy",   buyPrice: 1.10,  sellPrice: 1.89  },
    "0123456789012": { name: "Cheddar Cheese 400g", category: "Dairy",   buyPrice: 2.80,  sellPrice: 4.49  },
  };

  const scan = (code) => {
    const bc  = code.trim(); if (!bc) return;
    const ex  = products.find(p => p.barcode === bc);
    const demo= DEMOS[bc];
    if (ex)   { setFound(ex);   setForm({ name: ex.name,   category: ex.category,   buyPrice: ex.buyPrice,   sellPrice: ex.sellPrice,   qty: "", alert: ex.alert   }); notify("✅ Found: " + ex.name); }
    else      { setFound(null); setForm({ name: demo?.name||"", category: demo?.category||"", buyPrice: demo?.buyPrice||"", sellPrice: demo?.sellPrice||"", qty: "", alert: "10" }); notify("📦 New product — fill details", C.amber); }
  };

  const handleReceive = () => {
    if (!barcode || !form.name || !form.qty) return notify("Fill all required fields", C.red);
    const qty = parseInt(form.qty), bp = parseFloat(form.buyPrice), sp = parseFloat(form.sellPrice);
    const entry = { id: uid(), date: today(), barcode: barcode.trim(), name: form.name, qty, unitCost: bp, total: +(bp * qty).toFixed(2) };
    setStockIn(p => [...p, entry]);
    setProducts(prev => {
      const idx = prev.findIndex(p => p.barcode === barcode.trim());
      if (idx >= 0) { const u = [...prev]; u[idx] = { ...u[idx], stock: u[idx].stock + qty, buyPrice: bp, sellPrice: sp, alert: parseInt(form.alert) || 10 }; return u; }
      return [...prev, { id: uid(), barcode: barcode.trim(), name: form.name, category: form.category, buyPrice: bp, sellPrice: sp, stock: qty, alert: parseInt(form.alert) || 10 }];
    });
    notify(`✅ Received ${qty}x ${form.name} — Cost: ${fmt(bp * qty)}`);
    setBarcode(""); setFound(null); setForm({ name: "", category: "", buyPrice: "", sellPrice: "", qty: "", alert: "10" });
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>📥 Receive Stock</h1>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Scan barcode to log incoming stock from suppliers</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Scanner */}
        <div style={{ ...T.card, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Barcode Scanner</div>
          <label style={T.label}>Scan or Type Barcode</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input style={T.input} className="input-field" placeholder="Scan barcode here..." value={barcode}
              onChange={e => setBarcode(e.target.value)} onKeyDown={e => e.key === "Enter" && scan(barcode)} />
            <button style={T.btn(C.green)} className="btn" onClick={() => scan(barcode)}>Scan</button>
          </div>

          {/* Demo buttons */}
          <div style={{ background: "#0d1018", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 10 }}>🎯 Demo — click to simulate scan:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(DEMOS).map(([bc, d]) => (
                <button key={bc} onClick={() => { setBarcode(bc); scan(bc); }}
                  style={{ background: "#1c2030", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", color: C.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                  className="btn">{d.name}</button>
              ))}
            </div>
          </div>

          {/* Recent log */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Recent Received</div>
            {[...stockIn].reverse().slice(0, 4).map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{s.date} · {s.qty} units</div>
                </div>
                <span style={{ color: C.amber, fontWeight: 700, fontSize: 13 }}>{fmt(s.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ ...T.card, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            {found ? "✅ Update Existing Product" : "➕ New Product Details"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Product Name","name","text"],["Category","category","text"],["Buy Price (£)","buyPrice","number"],["Sell Price (£)","sellPrice","number"],["Qty Received","qty","number"],["Low Stock Alert","alert","number"]].map(([l,k,t]) => (
              <div key={k}>
                <label style={T.label}>{l}</label>
                <input style={T.input} className="input-field" type={t} placeholder={l} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>

          {/* Margin preview */}
          {form.buyPrice && form.sellPrice && (
            <div style={{ background: "#0d1f15", border: "1px solid #1a3a22", borderRadius: 8, padding: 14, margin: "16px 0" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>MARGIN PREVIEW</div>
              <div style={{ display: "flex", gap: 20 }}>
                <div><div style={{ fontSize: 10, color: C.muted }}>Per Unit</div><div style={{ color: C.greenL, fontWeight: 800, fontSize: 18 }}>{fmt(form.sellPrice - form.buyPrice)}</div></div>
                <div><div style={{ fontSize: 10, color: C.muted }}>Margin %</div><div style={{ color: C.greenL, fontWeight: 800, fontSize: 18 }}>{form.buyPrice > 0 ? (((form.sellPrice - form.buyPrice) / form.buyPrice) * 100).toFixed(1) : 0}%</div></div>
                {form.qty && <div><div style={{ fontSize: 10, color: C.muted }}>Total Cost</div><div style={{ color: C.amber, fontWeight: 800, fontSize: 18 }}>{fmt(form.buyPrice * form.qty)}</div></div>}
              </div>
            </div>
          )}
          <button style={{ ...T.btn(C.green), width: "100%", padding: "12px", fontSize: 15, marginTop: 8 }} className="btn" onClick={handleReceive}>
            {found ? "📥 Update Stock" : "➕ Add to Inventory"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RECORD SALE
// ══════════════════════════════════════════════════════════════════════════
function RecordSale({ products, setProducts, sales, setSales, notify }) {
  const [barcode,   setBarcode]   = useState("");
  const [basket,    setBasket]    = useState([]);
  const [saleDate,  setSaleDate]  = useState(today());

  const scan = (code) => {
    const p = products.find(pr => pr.barcode === code.trim());
    if (!p)          return notify("❌ Product not found", C.red);
    if (p.stock < 1) return notify(`⚠️ ${p.name} is out of stock!`, C.amber);
    setBasket(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) { if (ex.qty >= p.stock) return notify("⚠️ Not enough stock", C.amber) || prev; return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i); }
      return [...prev, { ...p, qty: 1 }];
    });
    setBarcode(""); notify(`✅ Added: ${p.name}`);
  };

  const confirmSale = () => {
    if (basket.length === 0) return;
    const newSales = basket.map(item => ({ id: uid(), date: saleDate, barcode: item.barcode, name: item.name, qty: item.qty, buyPrice: item.buyPrice, sellPrice: item.sellPrice }));
    setSales(p => [...p, ...newSales]);
    setProducts(prev => prev.map(p => { const b = basket.find(i => i.id === p.id); return b ? { ...p, stock: p.stock - b.qty } : p; }));
    notify(`✅ Sale recorded! Revenue: ${fmt(basket.reduce((a, i) => a + i.sellPrice * i.qty, 0))}`);
    setBasket([]);
  };

  const rev    = basket.reduce((a, i) => a + i.sellPrice * i.qty, 0);
  const cost   = basket.reduce((a, i) => a + i.buyPrice  * i.qty, 0);
  const profit = rev - cost;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>💳 Record a Sale</h1>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Scan products sold to update stock and profit records</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Scanner side */}
        <div style={{ ...T.card, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Scan Product</div>
          <label style={T.label}>Sale Date</label>
          <input type="date" style={{ ...T.input, marginBottom: 12 }} className="input-field" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
          <label style={T.label}>Barcode</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input style={T.input} className="input-field" placeholder="Scan barcode..." value={barcode}
              onChange={e => setBarcode(e.target.value)} onKeyDown={e => e.key === "Enter" && scan(barcode)} autoFocus />
            <button style={T.btn(C.green)} className="btn" onClick={() => scan(barcode)}>Scan</button>
          </div>

          {/* Quick product list */}
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Quick Select</div>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {["Product", "Stock", "Price"].map(h => <th key={h} style={T.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="row-hover" style={{ cursor: "pointer", opacity: p.stock < 1 ? 0.4 : 1 }}
                    onClick={() => { setBarcode(p.barcode); scan(p.barcode); }}>
                    <td style={{ ...T.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={T.td}><span style={T.badge(p.stock === 0 ? C.red : p.stock <= p.alert ? C.amber : C.greenL)}>{p.stock}</span></td>
                    <td style={{ ...T.td, color: C.blue, fontWeight: 700 }}>{fmt(p.sellPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Basket */}
        <div style={{ ...T.card, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Sale Basket</div>
          {basket.length === 0
            ? <div style={{ textAlign: "center", padding: "50px 0", color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🧺</div>
                <div style={{ fontSize: 13 }}>Scan products to add to this sale</div>
              </div>
            : <>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                  <thead><tr>
                    {["Product", "Qty", "Price", "Total", ""].map(h => <th key={h} style={T.th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {basket.map(item => (
                      <tr key={item.id} className="row-hover">
                        <td style={{ ...T.td, fontWeight: 700 }}>{item.name}</td>
                        <td style={T.td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, width: 24, height: 24, cursor: "pointer", color: C.text, fontSize: 14 }}
                              onClick={() => setBasket(b => b.map(i => i.id === item.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))}>−</button>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{item.qty}</span>
                            <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, width: 24, height: 24, cursor: "pointer", color: C.text, fontSize: 14 }}
                              onClick={() => setBasket(b => b.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}>+</button>
                          </div>
                        </td>
                        <td style={T.td}>{fmt(item.sellPrice)}</td>
                        <td style={{ ...T.td, color: C.blue, fontWeight: 700 }}>{fmt(item.sellPrice * item.qty)}</td>
                        <td style={T.td}>
                          <button style={{ background: "#1a0a0a", border: `1px solid #2a1515`, borderRadius: 4, padding: "3px 8px", color: C.red, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                            onClick={() => setBasket(b => b.filter(i => i.id !== item.id))}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div style={{ background: "#0d1018", borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div><div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>REVENUE</div><div style={{ color: C.blue, fontWeight: 800, fontSize: 20 }}>{fmt(rev)}</div></div>
                    <div><div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>COST</div><div style={{ color: C.amber, fontWeight: 800, fontSize: 20 }}>{fmt(cost)}</div></div>
                    <div><div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>PROFIT</div><div style={{ color: C.greenL, fontWeight: 800, fontSize: 20 }}>{fmt(profit)}</div></div>
                  </div>
                  <button style={{ ...T.btn(C.green), width: "100%", padding: 13, fontSize: 15 }} className="btn" onClick={confirmSale}>✅ Confirm & Record Sale</button>
                  <button style={{ ...T.btn("#1c2030"), width: "100%", marginTop: 8, padding: 10, border: `1px solid ${C.border}`, color: C.red }} className="btn" onClick={() => setBasket([])}>🗑 Clear Basket</button>
                </div>
              </>
          }
        </div>
      </div>

      {/* Recent sales */}
      <div style={{ ...T.card, padding: 22, marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Recent Sales Log</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Date","Product","Qty","Buy Price","Sell Price","Profit"].map(h=><th key={h} style={T.th}>{h}</th>)}</tr></thead>
          <tbody>
            {[...sales].reverse().slice(0, 8).map(s => (
              <tr key={s.id} className="row-hover">
                <td style={{ ...T.td, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.muted }}>{s.date}</td>
                <td style={{ ...T.td, fontWeight: 700 }}>{s.name}</td>
                <td style={T.td}>{s.qty}</td>
                <td style={{ ...T.td, color: C.amber }}>{fmt(s.buyPrice)}</td>
                <td style={{ ...T.td, color: C.blue }}>{fmt(s.sellPrice)}</td>
                <td style={T.td}><span style={T.badge(C.greenL)}>{fmt((s.sellPrice - s.buyPrice) * s.qty)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// INVENTORY
// ══════════════════════════════════════════════════════════════════════════
function Inventory({ products, setProducts, notify }) {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [eForm,  setEForm]  = useState({});

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p) => { setEditId(p.id); setEForm({ name: p.name, category: p.category, buyPrice: p.buyPrice, sellPrice: p.sellPrice, stock: p.stock, alert: p.alert }); };
  const saveEdit  = () => {
    setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...eForm, buyPrice: parseFloat(eForm.buyPrice), sellPrice: parseFloat(eForm.sellPrice), stock: parseInt(eForm.stock), alert: parseInt(eForm.alert) } : p));
    notify("✅ Product updated"); setEditId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>📦 Inventory</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{products.length} products</p>
        </div>
        <div style={{ flex: 1 }} />
        <input style={{ ...T.input, width: 280 }} className="input-field" placeholder="🔍 Search name, barcode, category..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Products",   value: products.length,                                                        color: C.blue  },
          { label: "Stock Value",      value: fmt(products.reduce((a, p) => a + p.stock * p.buyPrice, 0)),            color: C.amber },
          { label: "Low Stock",        value: products.filter(p => p.stock > 0 && p.stock <= p.alert).length,        color: C.amber },
          { label: "Out of Stock",     value: products.filter(p => p.stock === 0).length,                            color: C.red   },
        ].map(k => (
          <div key={k.label} style={{ ...T.card, padding: 16, borderLeft: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...T.card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#0d1018" }}>
            {["Barcode","Product","Category","Buy £","Sell £","Margin","Stock","Value","Status","Actions"].map(h => <th key={h} style={T.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const margin = p.buyPrice > 0 ? (((p.sellPrice - p.buyPrice) / p.buyPrice) * 100).toFixed(1) : 0;
              const status = p.stock === 0 ? ["Out of Stock", C.red] : p.stock <= p.alert ? ["Low Stock", C.amber] : ["In Stock", C.greenL];
              if (editId === p.id) return (
                <tr key={p.id} style={{ background: "#141824" }}>
                  <td style={{ ...T.td, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.muted }}>{p.barcode}</td>
                  {["name","category","buyPrice","sellPrice","stock","alert"].map(k => (
                    <td key={k} style={T.td}><input style={{ ...T.input, padding: "5px 8px", fontSize: 12 }} className="input-field" value={eForm[k]} onChange={e => setEForm(f => ({ ...f, [k]: e.target.value }))} /></td>
                  ))}
                  <td style={T.td} /><td style={T.td} />
                  <td style={T.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={T.btn(C.green)} className="btn" onClick={saveEdit}>Save</button>
                      <button style={{ ...T.btn(C.card), border: `1px solid ${C.border}`, color: C.muted }} className="btn" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              );
              return (
                <tr key={p.id} className="row-hover">
                  <td style={{ ...T.td, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.muted }}>{p.barcode}</td>
                  <td style={{ ...T.td, fontWeight: 700 }}>{p.name}</td>
                  <td style={T.td}><span style={T.badge(C.indigo)}>{p.category}</span></td>
                  <td style={{ ...T.td, color: C.amber }}>{fmt(p.buyPrice)}</td>
                  <td style={{ ...T.td, color: C.blue }}>{fmt(p.sellPrice)}</td>
                  <td style={T.td}><span style={T.badge(parseFloat(margin) > 30 ? C.greenL : C.amber)}>{margin}%</span></td>
                  <td style={{ ...T.td, fontFamily: "'JetBrains Mono',monospace" }}>{p.stock}</td>
                  <td style={T.td}>{fmt(p.stock * p.buyPrice)}</td>
                  <td style={T.td}><span style={T.badge(status[1])}>{status[0]}</span></td>
                  <td style={T.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...T.btn(C.card), border: `1px solid ${C.border}`, padding: "5px 12px", fontSize: 12, color: C.muted }} className="btn" onClick={() => startEdit(p)}>✏️ Edit</button>
                      <button style={{ background: "#1a0a0a", border: `1px solid #2a1515`, borderRadius: 8, padding: "5px 10px", color: C.red, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }} onClick={() => { setProducts(prev => prev.filter(pr => pr.id !== p.id)); notify("🗑 Removed", C.amber); }}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// P&L REPORTS
// ══════════════════════════════════════════════════════════════════════════
function Reports({ products, sales, stockIn, month, setMonth }) {
  const ms      = sales.filter(s => s.date.startsWith(month));
  const si      = stockIn.filter(s => s.date.startsWith(month));
  const rev     = ms.reduce((a, s) => a + s.sellPrice * s.qty, 0);
  const cogs    = ms.reduce((a, s) => a + s.buyPrice  * s.qty, 0);
  const spent   = si.reduce((a, s) => a + s.total, 0);
  const profit  = rev - cogs;
  const margin  = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
  const label   = new Date(month + "-15").toLocaleString("default", { month: "long", year: "numeric" });

  const breakdown = products.map(p => {
    const ps  = ms.filter(s => s.barcode === p.barcode);
    const qty = ps.reduce((a, s) => a + s.qty, 0);
    const r   = ps.reduce((a, s) => a + s.sellPrice * s.qty, 0);
    const c   = ps.reduce((a, s) => a + s.buyPrice  * s.qty, 0);
    return { ...p, soldQty: qty, revenue: r, cost: c, profit: r - c };
  }).sort((a, b) => b.profit - a.profit);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>📈 Profit & Loss Report</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Monthly financial statement — {label}</p>
        </div>
        <div style={{ flex: 1 }} />
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ ...T.input, width: "auto", marginRight: 10 }} className="input-field" />
        <button style={T.btn(C.blue)} className="btn" onClick={() => window.print()}>🖨️ Print PDF</button>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0d1f15,#111d16)", border: "1px solid #1e3024", borderRadius: 14, padding: 28, marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: C.greenL, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>AISLEMART · MONTHLY P&L STATEMENT</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{label}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
          {[
            { label: "Gross Revenue",   value: fmt(rev),              color: C.blue                        },
            { label: "Cost of Goods",   value: fmt(cogs),             color: C.amber                       },
            { label: "Stock Purchased", value: fmt(spent),            color: C.indigo                      },
            { label: profit >= 0 ? "Net Profit" : "Net Loss", value: fmt(Math.abs(profit)), color: profit >= 0 ? C.greenL : C.red },
            { label: "Profit Margin",   value: margin + "%",          color: profit >= 0 ? C.greenL : C.red },
          ].map(k => (
            <div key={k.label} style={{ background: "#0a0f14", borderRadius: 10, padding: 16, borderTop: `2px solid ${k.color}` }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Income statement */}
        <div style={{ ...T.card, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>📄 Income Statement</div>
          {[
            { label: "Gross Revenue",           value: rev,    color: C.blue,                          bold: false },
            { label: "Less: Cost of Goods Sold",value: -cogs,  color: C.amber,                         bold: false },
            { label: "────────────────────",    value: null                                                        },
            { label: "Gross Profit",             value: profit, color: profit >= 0 ? C.greenL : C.red,  bold: true  },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: row.value === null ? C.border : C.muted, fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
              <div style={{ flex: 1 }} />
              {row.value !== null && <b style={{ color: row.color, fontSize: 16, fontFamily: "inherit" }}>{row.value < 0 ? `(${fmt(Math.abs(row.value))})` : fmt(row.value)}</b>}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ ...T.card, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>📊 Sales Statistics</div>
          {[
            ["Total Transactions",    ms.length],
            ["Total Units Sold",      ms.reduce((a, s) => a + s.qty, 0)],
            ["Avg Revenue / Sale",    fmt(ms.length > 0 ? rev / ms.length : 0)],
            ["Unique Products Sold",  new Set(ms.map(s => s.barcode)).size],
            ["Stock Lines Received",  si.length],
            ["Total Stock Spend",     fmt(spent)],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontSize: 13 }}>{l}</span>
              <div style={{ flex: 1 }} />
              <b style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>{v}</b>
            </div>
          ))}
        </div>
      </div>

      {/* Product breakdown */}
      <div style={{ ...T.card, padding: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>🏷️ Product-by-Product Breakdown</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#0d1018" }}>
            {["Product","Category","Units Sold","Revenue","COGS","Profit","Margin","Stock Left"].map(h => <th key={h} style={T.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {breakdown.map(p => {
              const m = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) : "-";
              return (
                <tr key={p.id} className="row-hover">
                  <td style={{ ...T.td, fontWeight: 700 }}>{p.name}</td>
                  <td style={T.td}><span style={T.badge(C.indigo)}>{p.category}</span></td>
                  <td style={{ ...T.td, fontFamily: "'JetBrains Mono',monospace" }}>{p.soldQty || "—"}</td>
                  <td style={{ ...T.td, color: C.blue, fontWeight: 700 }}>{p.soldQty ? fmt(p.revenue) : "—"}</td>
                  <td style={{ ...T.td, color: C.amber }}>{p.soldQty ? fmt(p.cost) : "—"}</td>
                  <td style={T.td}>{p.soldQty ? <span style={T.badge(p.profit >= 0 ? C.greenL : C.red)}>{fmt(p.profit)}</span> : "—"}</td>
                  <td style={T.td}>{m !== "-" ? <span style={T.badge(parseFloat(m) > 25 ? C.greenL : C.amber)}>{m}%</span> : "—"}</td>
                  <td style={T.td}><span style={T.badge(p.stock === 0 ? C.red : p.stock <= p.alert ? C.amber : C.greenL)}>{p.stock}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ms.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13 }}>
            No sales recorded for {label}. Go to Record Sale to add transactions.
          </div>
        )}
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════
// CUSTOMER CALLER ID
// ══════════════════════════════════════════════════════════════════════════
function CustomerCallerID() {
  const [customers, setCustomers] = useState([
    {id:1,name:'Ahmed Khan',phone:'07700111222',address:'12 Bradford Rd',notes:'Likes extra sauce',type:'VIP',spend:'£45',calls:8,lastCall:'Today'},
    {id:2,name:'Sarah Patel',phone:'07811334455',address:'5 Mill Lane',notes:'Vegetarian only',type:'Regular',spend:'£22',calls:3,lastCall:'Yesterday'},
    {id:3,name:'Mohammed Ali',phone:'07922556677',address:'',notes:'',type:'Regular',spend:'£18',calls:2,lastCall:'12 May'},
    {id:4,name:'Lisa Brown',phone:'07533778899',address:'',notes:'New customer',type:'New',spend:'',calls:1,lastCall:'Today'},
  ]);
  const [nextId, setNextId] = useState(5);
  const [callsToday, setCallsToday] = useState(0);
  const [simPhone, setSimPhone] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({name:'',phone:'',address:'',notes:'',type:'Regular',spend:''});
  const [saveMsg, setSaveMsg] = useState('');

  const initials = name => name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();

  const incomingCall = () => {
    const ph = simPhone.trim().replace(/\s+/g,'');
    if (!ph) return;
    setCallsToday(c => c+1);
    const match = customers.find(c => c.phone.replace(/\s+/g,'') === ph);
    if (match) {
      setCustomers(prev => prev.map(c => c.id === match.id ? {...c, calls: c.calls+1, lastCall:'Just now'} : c));
      setActiveCall({...match, found:true});
    } else {
      setActiveCall({found:false, phone:ph});
      setForm(f => ({...f, phone:ph}));
    }
  };

  const endCall = () => { setActiveCall(null); setSimPhone(''); };

  const saveCustomer = () => {
    if (!form.name || !form.phone) { setSaveMsg('Name and phone required.'); setTimeout(()=>setSaveMsg(''),3000); return; }
    const exists = customers.find(c => c.phone.replace(/\s+/g,'') === form.phone.replace(/\s+/g,''));
    if (exists) { setSaveMsg('Number already exists: ' + exists.name); setTimeout(()=>setSaveMsg(''),3000); return; }
    setCustomers(prev => [...prev, {...form, id:nextId, calls:0, lastCall:'Never'}]);
    setNextId(n => n+1);
    setForm({name:'',phone:'',address:'',notes:'',type:'Regular',spend:''});
    setSaveMsg('✅ Customer saved!');
    setTimeout(()=>setSaveMsg(''),3000);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const tagColor = t => t==='VIP' ? C.amber : t==='New' ? C.greenL : C.blue;

  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-0.5,marginBottom:6}}>📞 Customer Caller ID</h1>
      <p style={{color:C.muted,fontSize:13,marginBottom:20}}>Enter an incoming phone number to instantly identify the customer</p>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        {[
          {label:'Total Customers', value:customers.length,                               color:C.blue},
          {label:'VIP Customers',   value:customers.filter(c=>c.type==='VIP').length,     color:C.amber},
          {label:'Calls Today',     value:callsToday,                                     color:C.greenL},
        ].map(k=>(
          <div key={k.label} style={{...T.card,padding:16,borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:28,fontWeight:800,color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Caller ID box */}
      <div style={{...T.card,padding:22,marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:14}}>📲 Incoming Call</div>
        <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
          <input style={{...T.input,flex:1,minWidth:200}} className="input-field"
            placeholder="Enter incoming phone number..." value={simPhone}
            onChange={e=>setSimPhone(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&incomingCall()} />
          <button style={{...T.btn(C.green),padding:'10px 20px'}} className="btn" onClick={incomingCall}>📞 Incoming Call</button>
          <button style={{...T.btn(C.red),padding:'10px 20px'}} className="btn" onClick={endCall}>📵 End Call</button>
        </div>

        {!activeCall && (
          <div style={{textAlign:'center',padding:'24px 0',color:C.muted,border:`1px dashed ${C.border}`,borderRadius:8,fontSize:13}}>
            No active call — enter a phone number above
          </div>
        )}

        {activeCall && activeCall.found && (
          <div style={{background:'#0d1f15',border:'1px solid #1a3a22',borderRadius:10,padding:18}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:activeCall.type==='VIP'?C.amber:C.green,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#fff',flexShrink:0}}>
                {initials(activeCall.name)}
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:C.greenL}}>{activeCall.name}</div>
                <div style={{fontSize:13,color:C.muted,marginTop:2}}>{activeCall.phone}</div>
                <span style={{...T.badge(tagColor(activeCall.type)),marginTop:4}}>{activeCall.type} · {activeCall.calls} calls</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {[['Address',activeCall.address||'—'],['Avg Spend',activeCall.spend||'—'],['Notes',activeCall.notes||'—']].map(([l,v])=>(
                <div key={l} style={{background:C.card,borderRadius:8,padding:'10px 12px'}}>
                  <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCall && !activeCall.found && (
          <div style={{background:'#1a1200',border:'1px solid #3a2e00',borderRadius:10,padding:18}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:52,height:52,borderRadius:'50%',background:C.muted,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'#fff'}}>?</div>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:C.amber}}>Unknown Caller</div>
                <div style={{fontSize:13,color:C.muted,marginTop:2}}>{activeCall.phone}</div>
                <span style={{...T.badge(C.amber),marginTop:4}}>Not in directory — add below</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:20}}>
        {/* Add Customer */}
        <div style={{...T.card,padding:22}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:14}}>➕ Add Customer</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[['Full Name','name','text'],['Phone Number','phone','text'],['Address','address','text'],['Avg Spend','spend','text'],['Notes','notes','text']].map(([l,k,t])=>(
              <div key={k} style={k==='notes'?{gridColumn:'1/-1'}:{}}>
                <label style={T.label}>{l}</label>
                <input style={T.input} className="input-field" type={t} placeholder={l} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              </div>
            ))}
            <div>
              <label style={T.label}>Type</label>
              <select style={{...T.input}} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                <option>Regular</option><option>VIP</option><option>New</option>
              </select>
            </div>
          </div>
          <button style={{...T.btn(C.green),width:'100%',padding:12,marginTop:12,fontSize:14}} className="btn" onClick={saveCustomer}>
            💾 Save Customer
          </button>
          {saveMsg && <div style={{fontSize:12,marginTop:8,color:saveMsg.startsWith('✅')?C.greenL:C.red}}>{saveMsg}</div>}
        </div>

        {/* Directory */}
        <div style={{...T.card,padding:22}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:1.5,marginBottom:14}}>👥 Customer Directory</div>
          <input style={{...T.input,marginBottom:12}} className="input-field"
            placeholder="Search by name or phone..." value={search} onChange={e=>setSearch(e.target.value)} />
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>
              {['Name','Phone','Type','Calls','Last Call',''].map(h=><th key={h} style={T.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} className="row-hover">
                  <td style={{...T.td,fontWeight:700}}>{c.name}</td>
                  <td style={{...T.td,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.muted}}>{c.phone}</td>
                  <td style={T.td}><span style={T.badge(tagColor(c.type))}>{c.type}</span></td>
                  <td style={T.td}>{c.calls}</td>
                  <td style={{...T.td,color:C.muted,fontSize:12}}>{c.lastCall}</td>
                  <td style={T.td}>
                    <button style={{background:'#1a0a0a',border:`1px solid #2a1515`,borderRadius:4,padding:'3px 8px',color:C.red,cursor:'pointer',fontSize:12,fontFamily:'inherit'}}
                      onClick={()=>setCustomers(prev=>prev.filter(x=>x.id!==c.id))}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
