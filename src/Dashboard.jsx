import React, { useState, useEffect } from 'react';

// ---------- Mock Data ----------
const summary = {
  interactions: { value: 9842, delta: 612 },
  sales: { value: 412, delta: 24.6, yesterday: 331 },
  revenue: { value: 35248.92, delta: 28.4, yesterday: 27452.10 },
  conversion: { value: 22.7, target: 25, status: 'Near target' },
  topCreator: { name: 'Brooke', note: 'Most active today' },
};

const recentSales = [
  { time: '23:50', agent: 'Ryno', client: 'Barbara', amount: 220 },
  { time: '23:49', agent: 'Ami', client: 'Hallie', amount: 150 },
  { time: '23:39', agent: 'Russ', client: 'Amber', amount: 380 },
  { time: '23:21', agent: 'Sam', client: 'Tasha', amount: 95 },
  { time: '23:10', agent: 'Don Day', client: 'Erin', amount: 260 },
];

const topPerformers = [
  { rank: 1, name: 'Ryno', sales: 48, chats: 96, conv: 50.0, revenue: 7184.40 },
  { rank: 2, name: 'Russ', sales: 41, chats: 142, conv: 28.9, revenue: 6212.75 },
  { rank: 3, name: 'Ami', sales: 39, chats: 311, conv: 12.5, revenue: 5460.10 },
  { rank: 4, name: 'Sam', sales: 33, chats: 287, conv: 11.5, revenue: 4127.50 },
  { rank: 5, name: 'Don Day', sales: 28, chats: 264, conv: 10.6, revenue: 3318.20 },
];

const needsAttention = [
  { name: 'Josh', chats: 204, sales: 1 },
  { name: 'shittyrose', chats: 88, sales: 0 },
  { name: 'JR', chats: 67, sales: 0 },
];

const targets = {
  daily: { current: 35249, goal: 35000, note: 'Daily target smashed!' },
  weekly: { current: 168420, goal: 210000 },
  monthly: { current: 612300, goal: 900000 },
  conversion: { current: 22.7, goal: 25, note: 'Mon–Thu target (25%) · 2.3pts to go' },
};

const teamRoster = [
  { name: 'Ryno', role: 'Closer', shift: 'Night', sales: 48, revenue: 7184.40, status: 'online' },
  { name: 'Russ', role: 'Closer', shift: 'Night', sales: 41, revenue: 6212.75, status: 'online' },
  { name: 'Ami', role: 'Chatter', shift: 'Day', sales: 39, revenue: 5460.10, status: 'online' },
  { name: 'Sam', role: 'Chatter', shift: 'Day', sales: 33, revenue: 4127.50, status: 'offline' },
  { name: 'Don Day', role: 'Chatter', shift: 'Swing', sales: 28, revenue: 3318.20, status: 'online' },
  { name: 'Brooke', role: 'Creator Lead', shift: 'Day', sales: 22, revenue: 2640.00, status: 'online' },
  { name: 'Josh', role: 'Chatter', shift: 'Night', sales: 1, revenue: 95.00, status: 'idle' },
  { name: 'shittyrose', role: 'Chatter', shift: 'Day', sales: 0, revenue: 0, status: 'idle' },
  { name: 'JR', role: 'Chatter', shift: 'Swing', sales: 0, revenue: 0, status: 'idle' },
];

// ---------- Helpers ----------
const fmtMoney = (n) => `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (cur, goal) => Math.min(100, (cur / goal) * 100);

const colors = {
  bg: '#0c0d0f',
  panel: '#131417',
  panelBorder: '#26282d',
  card: '#1a1b1f',
  pink: '#4d8eff',     // primary accent (blue)
  pinkSoft: '#8fb7ff', // soft accent (light blue)
  purple: '#4d8eff',
  green: '#6ee7a8',
  amber: '#e5e7eb',
  red: '#f0a3a3',
  text: '#f5f6f7',
  textDim: '#9ba0a8',
  textFaint: '#5b5f66',
};

const medal = (rank) => `#${rank}`;

// ---------- Small UI Pieces ----------
function StatCard({ label, value, delta, deltaLabel, sub, accent }) {
  return (
    <div style={{
      background: colors.card,
      border: `1px solid ${colors.panelBorder}`,
      borderRadius: 12,
      padding: '16px 18px',
      flex: 1,
      minWidth: 150,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 0.6, color: colors.textDim, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || colors.text, lineHeight: 1.1 }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 12, color: colors.green, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>▲</span><span>{delta}</span>
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: colors.textFaint, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max, color, height = 10 }) {
  return (
    <div style={{ background: '#1d1f24', borderRadius: 99, height, overflow: 'hidden', width: '100%' }}>
      <div style={{
        width: `${pct(value, max)}%`,
        height: '100%',
        background: color || `linear-gradient(90deg, ${colors.pink}, ${colors.purple})`,
        borderRadius: 99,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

function TargetRow({ title, current, goal, note, suffix }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        <span style={{ color: colors.pinkSoft, fontWeight: 700, fontSize: 14 }}>
          {current}{suffix} / {goal}{suffix}
        </span>
      </div>
      <ProgressBar value={current} max={goal} />
      {note && <div style={{ fontSize: 11.5, color: colors.textFaint, marginTop: 6 }}>{note}</div>}
    </div>
  );
}

function StatusDot({ status }) {
  const c = status === 'online' ? colors.green : status === 'idle' ? colors.amber : colors.textFaint;
  return <span style={{ width: 8, height: 8, borderRadius: 99, background: c, display: 'inline-block' }} />;
}

// ---------- Tabs ----------
function OverviewTab() {
  const todaySalesPct = Math.min(150, (summary.sales.value / summary.sales.yesterday) * 100);

  return (
    <div>
      <div style={{
        background: colors.panel,
        border: `1px solid ${colors.panelBorder}`,
        borderRadius: 16,
        padding: 22,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h2 style={{ color: colors.text, fontSize: 16, margin: 0, fontWeight: 700, letterSpacing: 0.2 }}>Today's summary</h2>
          <span style={{ fontSize: 11, color: colors.textFaint }}>Live · auto-refreshes every 60s</span>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
          <StatCard label="Interactions today" value={summary.interactions.value.toLocaleString()} delta={`${summary.interactions.delta} vs yesterday`} />
          <StatCard label="Sales today" value={summary.sales.value} delta={`${summary.sales.delta}% vs same time yesterday`} sub={`Projected EOD: ${summary.sales.value} sales`} accent={colors.pinkSoft} />
          <StatCard label="Revenue today" value={fmtMoney(summary.revenue.value)} delta={`${summary.revenue.delta}% vs same time yesterday`} sub={`Projected EOD: ${fmtMoney(summary.revenue.value)}`} accent={colors.amber} />
          <StatCard label="Conversion today" value={`${summary.conversion.value}%`} sub={`Target: ${summary.conversion.target}% · ${summary.conversion.status}`} />
          <StatCard label="Top creator" value={summary.topCreator.name} sub={summary.topCreator.note} accent={colors.pinkSoft} />
        </div>

        <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Projected vs yesterday ({summary.sales.yesterday} sales · {fmtMoney(summary.revenue.yesterday)})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={todaySalesPct} max={150} color={colors.green} height={8} />
            <div style={{ fontSize: 11.5, color: colors.green, marginTop: 6 }}>
              On track to beat yesterday · {Math.round(todaySalesPct)}% of yesterday's total
            </div>
          </div>
          <div style={{
            background: '#15191f', border: `1px solid ${colors.pink}40`, borderRadius: 10,
            padding: '8px 14px', fontSize: 12.5, color: colors.pinkSoft, whiteSpace: 'nowrap',
          }}>
            Pacing well above yesterday — keep momentum on re-engagements before EOD.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {/* Recent Sales */}
          <div style={{ flex: 1.2, minWidth: 320 }}>
            <h3 style={{ color: colors.pink, fontSize: 13, marginBottom: 10 }}>Recent sales today</h3>
            <div style={{ background: '#101113', borderRadius: 10, overflow: 'hidden' }}>
              {recentSales.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderBottom: i < recentSales.length - 1 ? `1px solid ${colors.panelBorder}` : 'none',
                  fontSize: 13,
                }}>
                  <span style={{ color: colors.textFaint, width: 42 }}>{s.time}</span>
                  <span style={{ color: colors.pinkSoft, fontWeight: 600, width: 64 }}>{s.agent}</span>
                  <span style={{ flex: 1, color: colors.text }}>{s.client}</span>
                  <span style={{ color: colors.amber, fontWeight: 700 }}>{fmtMoney(s.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ color: colors.amber, fontSize: 13, marginBottom: 10 }}>Needs attention</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {needsAttention.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, background: '#15191f',
                  border: `1px solid ${colors.panelBorder}`, borderRadius: 10, padding: '10px 14px',
                }}>
                  <StatusDot status="idle" />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                  <span style={{ color: colors.textFaint, fontSize: 12 }}>{p.chats} chats · {p.sales} sales</span>
                  <button style={{
                    marginLeft: 'auto', background: 'transparent', border: `1px solid ${colors.textFaint}`,
                    color: colors.text, fontSize: 11.5, padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
                  }} title="Placeholder action — not yet wired up">
                    ✉ Chase
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <h3 style={{ color: colors.pink, fontSize: 13, margin: '24px 0 10px' }}>Top performers today</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topPerformers.map((p) => (
            <div key={p.rank} style={{
              display: 'flex', alignItems: 'center', gap: 12, background: '#101113',
              borderRadius: 10, padding: '10px 16px',
            }}>
              <span style={{ width: 22 }}>{medal(p.rank)}</span>
              <span style={{ fontWeight: 700, width: 80 }}>{p.name}</span>
              <span style={{ color: colors.pinkSoft, fontSize: 12.5 }}>{p.sales} sales</span>
              <span style={{ color: colors.textFaint, fontSize: 12.5 }}>{p.chats} chats · {p.conv}%</span>
              <span style={{ marginLeft: 'auto', color: colors.amber, fontWeight: 700 }}>{fmtMoney(p.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Targets */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: colors.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
          Targets
        </div>
        <TargetRow title="Daily sales" current={targets.daily.current} goal={targets.daily.goal} note={`${targets.daily.note}`} />
        <TargetRow title="Weekly sales" current={targets.weekly.current} goal={targets.weekly.goal} note={`${targets.weekly.goal - targets.weekly.current} to go`} />
        <TargetRow title="Monthly sales" current={targets.monthly.current} goal={targets.monthly.goal} note={`${targets.monthly.goal - targets.monthly.current} to go`} />
        <TargetRow title="Conversion rate" current={targets.conversion.current} goal={targets.conversion.goal} suffix="%" note={`${targets.conversion.note}`} />
      </div>
    </div>
  );
}

function LeaderboardTab() {
  const sorted = [...topPerformers].sort((a, b) => b.revenue - a.revenue);
  return (
    <div>
      <h2 style={{ color: colors.pink, fontSize: 16, marginBottom: 16 }}>Leaderboard — Today</h2>
      <div style={{ background: colors.panel, border: `1px solid ${colors.panelBorder}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
          padding: '10px 18px', fontSize: 11, color: colors.textDim, textTransform: 'uppercase',
          borderBottom: `1px solid ${colors.panelBorder}`,
        }}>
          <span>Rank</span><span>Agent</span><span>Sales</span><span>Chats</span><span>Conv.</span><span>Revenue</span>
        </div>
        {sorted.map((p, i) => (
          <div key={p.name} style={{
            display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
            padding: '14px 18px', alignItems: 'center',
            borderBottom: i < sorted.length - 1 ? `1px solid ${colors.panelBorder}` : 'none',
            background: i === 0 ? '#15191f' : 'transparent',
          }}>
            <span style={{ fontSize: 18 }}>{medal(i + 1)}</span>
            <span style={{ fontWeight: 700 }}>{p.name}</span>
            <span style={{ color: colors.pinkSoft }}>{p.sales}</span>
            <span style={{ color: colors.textDim }}>{p.chats}</span>
            <span style={{ color: colors.textDim }}>{p.conv}%</span>
            <span style={{ color: colors.amber, fontWeight: 700 }}>{fmtMoney(p.revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div>
      <h2 style={{ color: colors.pink, fontSize: 16, marginBottom: 16 }}>Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
        {teamRoster.map((m) => (
          <div key={m.name} style={{
            background: colors.card, border: `1px solid ${colors.panelBorder}`, borderRadius: 12, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <StatusDot status={m.status} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 10 }}>{m.role} · {m.shift} shift</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: colors.pinkSoft }}>{m.sales} sales</span>
              <span style={{ color: colors.amber, fontWeight: 700 }}>{fmtMoney(m.revenue)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- App Shell ----------
const TABS = [
  'Overview', 'Leaderboard', 'Bot Control', 'Team', 'Performance',
  'Coaching', 'Sales Intel', 'Intelligence', 'Data',
];

export default function Dashboard() {
  const [active, setActive] = useState('Overview');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const renderTab = () => {
    if (active === 'Overview') return <OverviewTab />;
    if (active === 'Leaderboard') return <LeaderboardTab />;
    if (active === 'Team') return <TeamTab />;
    return (
      <div style={{ color: colors.textFaint, fontSize: 14, padding: '60px 0', textAlign: 'center' }}>
        {active} — coming soon
      </div>
    );
  };

  return (
    <div style={{
      background: colors.bg, color: colors.text, minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '0 0 60px',
    }}>
      {/* Top Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', borderBottom: `1px solid ${colors.panelBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1.5, color: colors.text }}>
            ENVY<span style={{ color: colors.pink }}>.</span>
          </span>
          <div style={{ display: 'flex', gap: 22 }}>
            {TABS.map((t) => (
              <span
                key={t}
                onClick={() => setActive(t)}
                style={{
                  fontSize: 13.5, cursor: 'pointer',
                  color: active === t ? colors.pink : colors.textDim,
                  borderBottom: active === t ? `2px solid ${colors.pink}` : '2px solid transparent',
                  paddingBottom: 16, fontWeight: active === t ? 600 : 400,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 11, background: colors.card, border: `1px solid ${colors.panelBorder}`,
            padding: '6px 10px', borderRadius: 6, color: colors.textDim,
          }}>
            sale brooke 300...
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.green,
            background: '#10241a', border: `1px solid ${colors.green}33`, padding: '5px 10px', borderRadius: 99,
          }}>
            <StatusDot status="online" /> Online
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 28px', maxWidth: 1400, margin: '0 auto' }}>
        {renderTab()}
      </div>
    </div>
  );
}
