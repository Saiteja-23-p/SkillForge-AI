import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Code, Sparkles } from 'lucide-react';

// Using actual fetch call directly since importing groq-sdk in the Vite browser client often requires polyfills for Node features.
const getApiKey = () => {
  return localStorage.getItem('skillforge_groq_key') || import.meta.env.VITE_GROQ_API_KEY || "";
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', type: 'text', content: "Hi! I'm your SkillForge AI mentor. Ready to dive into your learning track today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  
  // Maintain conversational history for context
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: "You are an expert AI mentor for a computer science and programming learning platform called SkillForge. You guide students, answer their questions clearly, provide examples, and give them coding tasks when they ask. Format code blocks using markdown with triple backticks. If they ask about preparing a resume, provide ATS-friendly formatting advice." }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessageContent = input;
    const newMsg = { id: Date.now(), sender: 'user', type: 'text', content: userMessageContent };
    
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: "user", content: userMessageContent }];
    setConversationHistory(newHistory);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getApiKey()}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: newHistory,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`API answered with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponseContent = data.choices[0].message.content;

      // Extract code blocks if any to display them specially, assuming the AI might output markdown
      const codeRegex = /```([\s\S]*?)```/g;
      const codeMatches = [...aiResponseContent.matchAll(codeRegex)];
      let contentWithoutCode = aiResponseContent.replace(codeRegex, '').trim();
      let codeSnippet = null;

      if (codeMatches.length > 0) {
        // Just extracting the first code match for the specialized code window UI we have
        let matchStr = codeMatches[0][1].trim();
        // Remove optional language identifier prefix attached to markdown codeblocks
        if (matchStr.includes('\\n')) {
          matchStr = matchStr.substring(matchStr.indexOf('\\n') + 1);
        }
        codeSnippet = matchStr;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        type: codeSnippet ? 'code' : 'text',
        content: contentWithoutCode || "Here's the code you requested:",
        codeSnippet: codeSnippet
      };

      setMessages((prev) => [...prev, aiMsg]);
      setConversationHistory([...newHistory, { role: "assistant", content: aiResponseContent }]);

    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'text',
        content: "Oops! I seem to have lost my connection to the server. Could you please try asking that again?"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)' }}>
        <Bot size={24} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Learning Assistant</h3>
        <Sparkles size={16} color="var(--secondary)" style={{ marginLeft: 'auto' }} />
      </header>
      
      <div ref={scrollRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '1rem', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            {msg.sender === 'ai' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="white" />
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
              
              {/* Process standard text chunks and basic markdown-like spacing */}
              {msg.content && (
                <div style={{
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-hover)',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  borderTopRightRadius: msg.sender === 'user' ? 0 : '16px',
                  borderTopLeftRadius: msg.sender === 'ai' ? 0 : '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  lineHeight: 1.6,
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              )}

              {msg.type === 'code' && msg.codeSnippet && (
                <div style={{ background: '#1e1e1e', padding: '1.25rem', borderRadius: '12px', width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', color: '#d4d4d4', overflowX: 'auto', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.codeSnippet}</pre>
                </div>
              )}

            </div>

            {msg.sender === 'user' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="var(--text-main)" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ background: 'var(--surface-hover)', padding: '1rem 1.25rem', borderRadius: '16px', borderTopLeftRadius: 0, display: 'flex', gap: '6px' }}>
              <div className="typing-dot" style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out' }}></div>
              <div className="typing-dot" style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
            </div>
            <style>{`@keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
          placeholder="Message your AI Mentor..."
          style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'white', outline: 'none', fontSize: '0.95rem' }}
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={!input.trim() || isTyping} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: input.trim() && !isTyping ? 1 : 0.6 }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
