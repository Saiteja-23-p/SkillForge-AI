import { LayoutDashboard, BookOpen, Mic, Trophy, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, onSettingsClick }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning', label: 'Learning Modules', icon: BookOpen },
    { id: 'interview', label: 'AI Mock Interview', icon: Mic },
  ];

  return (
    <aside className="glass-panel" style={{ width: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }} className="text-gradient">SkillForge AI</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem',
                background: isActive ? 'var(--surface-hover)' : 'transparent',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius: '12px', cursor: 'pointer',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                transition: 'all 0.2s', textAlign: 'left', fontSize: '1rem', fontWeight: 500
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--glass-bg)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
              {item.label}
              {isActive && (
                <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="btn btn-outline" onClick={onSettingsClick} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
          <Settings size={18} /> Settings
        </button>
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--accent)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
