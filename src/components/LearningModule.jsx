import { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, PlaySquare, Award, ArrowLeft, Play, FileText, Code as CodeIcon,
  Terminal, Network, Layout, Server, Database, Cpu, Cloud, Brain, Briefcase, Users,
  ChevronRight, Lock
} from 'lucide-react';
import Chatbot from './Chatbot';
import { learningTracks, generateModuleSteps } from '../data/learningPaths';

const IconMap = {
  Terminal, Network, Layout, Server, Database, Cpu, Cloud, Brain, Briefcase, Users
};

export default function LearningModule() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [steps, setSteps] = useState([]);

  // Load steps when a module is selected
  useEffect(() => {
    if (selectedModule && selectedTrack) {
      const generatedSteps = generateModuleSteps(selectedModule, selectedTrack.id === 'projects').map((step, idx) => ({
        ...step,
        completed: idx === 0, // Mock first step as completed
        active: idx === 1 // Mock second step as active
      }));
      setSteps(generatedSteps);
    }
  }, [selectedModule, selectedTrack]);

  const handleCompleteCurrent = () => {
    if (!selectedStep) return;
    const updatedSteps = steps.map(s => {
      if (s.id === selectedStep.id) return { ...s, completed: true, active: false };
      if (s.id === selectedStep.id + 1) return { ...s, active: true };
      return s;
    });
    setSteps(updatedSteps);
    setSelectedStep(updatedSteps.find(s => s.id === selectedStep.id + 1) || null);
  };

  // View: Grid of Learning Tracks
  const renderTracksView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingRight: '0.5rem' }}>
      <header className="glass-card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '0.5rem' }} className="text-gradient">Select a Learning Track</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Choose from structured paths spanning programming fundamentals to system design and AI.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {learningTracks.map((track) => {
          const Icon = IconMap[track.icon] || BookOpen;
          return (
            <div key={track.id} 
              className="glass-card"
              onClick={() => setSelectedTrack(track)}
              style={{ 
                padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2sease',
                display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${track.color}`
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${track.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${track.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={track.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{track.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, margin: 0, lineHeight: 1.5 }}>
                {track.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{track.modules.length} Modules</span>
                <ChevronRight size={18} color={track.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // View: List of Modules for a Track
  const renderModulesView = () => {
    const Icon = IconMap[selectedTrack.icon] || BookOpen;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
        <button 
          onClick={() => setSelectedTrack(null)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, alignSelf: 'flex-start' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Tracks
        </button>

        <header className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: `4px solid ${selectedTrack.color}` }}>
          <div style={{ width: 64, height: 64, borderRadius: '16px', background: `${selectedTrack.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={32} color={selectedTrack.color} />
          </div>
          <div>
             <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{selectedTrack.title}</h1>
             <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{selectedTrack.description}</p>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedTrack.modules.map((moduleName, index) => {
             const isLocked = index > 2; // visually lock modules beyond the first few for demo
             return (
               <div key={index} 
                 className="glass-card"
                 onClick={() => !isLocked && setSelectedModule(moduleName)}
                 style={{ 
                   padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', 
                   cursor: isLocked ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                   opacity: isLocked ? 0.6 : 1
                 }}
                 onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                 onMouseLeave={e => { if (!isLocked) e.currentTarget.style.background = 'var(--glass-bg)'; }}
               >
                 <div style={{ width: 40, height: 40, borderRadius: '50%', background: isLocked ? 'var(--surface)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLocked ? 'var(--text-muted)' : 'white', fontWeight: 'bold' }}>
                   {isLocked ? <Lock size={16} /> : index + 1}
                 </div>
                 <div style={{ flex: 1 }}>
                   <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', color: isLocked ? 'var(--text-muted)' : 'var(--text-main)' }}>{moduleName}</h3>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedTrack.id === 'projects' ? 'Project Build Step' : '6 Lessons'} &bull; 2.5 hours</span>
                 </div>
                 {!isLocked && <ChevronRight size={20} color="var(--primary)" />}
               </div>
             )
          })}
        </div>
      </div>
    );
  };

  // View: Learning Path (Overview of Module Steps)
  const renderPathView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
       <button 
          onClick={() => setSelectedModule(null)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, alignSelf: 'flex-start' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Modules
        </button>

        <header className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: selectedTrack.color, fontWeight: 600, fontSize: '0.9rem' }}>{selectedTrack.title}</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Module</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: 0 }} className="text-gradient">{selectedModule}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Dive deep into {selectedModule} with interactive lessons, conceptual explanations, and AI-guided practice.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: selectedTrack.color }}>
              <Award size={18} /> 500 XP
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <PlaySquare size={18} /> 95 Mins Total
            </div>
          </div>
        </header>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>Learning Path</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, index) => (
              <div key={step.id} 
                onClick={() => setSelectedStep(step)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                  background: step.active ? `${selectedTrack.color}15` : 'var(--surface)', 
                  border: step.active ? `1px solid ${selectedTrack.color}` : '1px solid transparent',
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                  opacity: step.completed || step.active ? 1 : 0.6
                }}
                onMouseEnter={e => {
                    if (!step.active) Object.assign(e.currentTarget.style, { background: 'var(--surface-hover)', border: '1px solid var(--border)' });
                }}
                onMouseLeave={e => {
                    if (!step.active) Object.assign(e.currentTarget.style, { background: 'var(--surface)', border: '1px solid transparent' });
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {step.completed ? (
                    <CheckCircle size={24} color="#10b981" />
                  ) : step.active ? (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: selectedTrack.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                      {index + 1}
                    </div>
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: step.active ? selectedTrack.color : 'var(--text-main)' }}>{step.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.duration}</p>
                </div>
                {step.active && (
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: selectedTrack.color }} onClick={(e) => { e.stopPropagation(); setSelectedStep(step); }}>
                    Continue
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  );

  // View: Step Details (Lesson itself)
  const renderStepView = () => (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => setSelectedStep(null)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <span style={{ fontSize: '0.85rem', color: selectedTrack.color, fontWeight: 600 }}>Step {selectedStep.id} of {steps.length}</span>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedStep.title}</h2>
        </div>
      </div>
      
      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {selectedStep.content.type === 'video' && (
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop" alt="Video Thumbnail" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: selectedTrack.color, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: `0 0 20px ${selectedTrack.color}80` }}>
               <Play size={28} color="white" style={{ marginLeft: '4px' }} />
            </div>
            <h3 style={{ position: 'relative', zIndex: 2, marginTop: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{selectedStep.content.videoTitle}</h3>
          </div>
        )}
        
        {selectedStep.content.type === 'article' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '12px', borderLeft: `4px solid ${selectedTrack.color}` }}>
             <FileText size={24} color={selectedTrack.color} />
             <h3 style={{ margin: 0 }}>Reading Material</h3>
          </div>
        )}

        {selectedStep.content.type === 'practice' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: `${selectedTrack.color}15`, borderRadius: '12px', borderLeft: `4px solid ${selectedTrack.color}` }}>
             <CodeIcon size={24} color={selectedTrack.color} />
             <h3 style={{ margin: 0, color: selectedTrack.color }}>Interactive Exercise</h3>
          </div>
        )}

        {selectedStep.content.type === 'quiz' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: `${selectedTrack.color}15`, borderRadius: '12px', borderLeft: `4px solid ${selectedTrack.color}` }}>
             <CheckCircle size={24} color={selectedTrack.color} />
             <h3 style={{ margin: 0, color: selectedTrack.color }}>Knowledge Check</h3>
          </div>
        )}
        
        <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-main)' }}>
          {selectedStep.content.description}
        </div>
        
        {selectedStep.content.codeSnippet && (
          <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.95rem', color: '#d4d4d4', border: '1px solid var(--border)', overflowX: 'auto' }}>
            <pre style={{ margin: 0 }}>{selectedStep.content.codeSnippet}</pre>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--surface)' }}>
         {selectedStep.completed && !selectedStep.active ? (
            <button className="btn btn-primary" onClick={handleCompleteCurrent}>Next Lesson</button>
         ) : (
            <button className="btn btn-primary" onClick={handleCompleteCurrent} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: selectedTrack.color }}>
               <CheckCircle size={18} /> Mark Complete & Continue
            </button>
         )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 400px', gap: '2rem', height: '100%', overflow: 'hidden' }}>
      {/* Left Pane: Content Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {!selectedTrack && renderTracksView()}
        {selectedTrack && !selectedModule && renderModulesView()}
        {selectedTrack && selectedModule && !selectedStep && renderPathView()}
        {selectedTrack && selectedModule && selectedStep && renderStepView()}
      </div>

      {/* Right Pane: AI Chatbot */}
      <div style={{ height: '100%', paddingBottom: '1rem' }}>
        <Chatbot />
      </div>
    </div>
  );
}
