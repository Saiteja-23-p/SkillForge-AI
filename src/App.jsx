import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LearningModule from './components/LearningModule';
import MockInterview from './components/MockInterview';
import { X, Key, Info } from 'lucide-react';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('skillforge_groq_key') || '');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'learning':
        return <LearningModule />;
      case 'interview':
        return <MockInterview />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('skillforge_groq_key', apiKeyInput.trim());
    setIsSettingsOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="main-content">
        <header className="glass-panel" style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>SkillForge AI System Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Student Profile</span>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              S
            </div>
          </div>
        </header>
        <div className="view-container">
          {renderView()}
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', border: '1px solid var(--border)'
          }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={22} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>System Settings</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Groq API Key</label>
              <input 
                type="password" 
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_..."
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
                  background: 'var(--bg-dark)', color: 'white', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <div style={{ 
                display: 'flex', gap: '8px', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px', 
                border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5'
              }}>
                <Info size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  The Groq Llama-3.3 model requires an API key. Your key is stored safely on your own browser (localStorage) and never sent to our servers. Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>console.groq.com</a>.
                </span>
              </div>
            </div>

            <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveSettings}>Save Configuration</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
