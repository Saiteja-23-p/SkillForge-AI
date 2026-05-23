import { Target, Flame, BookCheck, ArrowRight, Play } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const stats = [
    { label: 'Current Streak', value: '12 Days', icon: Flame, color: '#f43f5e' },
    { label: 'Modules Completed', value: '8/24', icon: BookCheck, color: '#06b6d4' },
    { label: 'Interview Readiness', value: '45%', icon: Target, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Student! 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ready to continue your journey to becoming a full-stack developer?</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: `rgba(${stat.color === '#f43f5e' ? '244,63,94' : stat.color === '#06b6d4' ? '6,182,212' : '139,92,246'}, 0.1)`, padding: '1rem', borderRadius: '12px' }}>
                <Icon size={28} color={stat.color} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.5rem' }}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Active Module */}
        <section className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Continue Learning</h2>
            <span style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>In Progress</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '120px', height: '120px', background: 'var(--surface)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Play size={40} color="var(--primary)" style={{ opacity: 0.8 }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>React Hooks & State Management</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Master useState, useEffect, and custom hooks to build complex interactive UIs. Complete the mini-project to unlock the next module.
              </p>
              <div style={{ background: 'var(--surface)', height: '8px', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px' }}></div>
              </div>
              <button className="btn btn-primary" onClick={() => onNavigate('learning')}>
                Resume Module <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Up Next / AI Suggestions */}
        <section className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>AI Recommendations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid var(--secondary)' }}>
              <h4 style={{ marginBottom: '4px' }}>Practice: Algorithm Design</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You struggled with big-O notation. Try these 3 new practice problems.</p>
            </div>
            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid var(--accent)' }}>
              <h4 style={{ marginBottom: '4px' }}>Behavioral Interview Prep</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>It's time to prepare your "Tell me about yourself" pitch.</p>
            </div>
          </div>
          <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }} onClick={() => onNavigate('interview')}>
            Start Mock Interview
          </button>
        </section>
      </div>
    </div>
  );
}
