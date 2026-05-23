import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, Play, Square, Award, AlertCircle, Volume2, Settings, RefreshCcw } from 'lucide-react';
import { learningTracks } from '../data/learningPaths';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export default function MockInterview() {
  const [sessionState, setSessionState] = useState('idle'); // idle, speaking, listening, evaluating, feedback
  const [transcript, setTranscript] = useState('');
  const [aiSpeech, setAiSpeech] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  // Customization
  const [selectedTrack, setSelectedTrack] = useState('frontend');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [topics, setTopics] = useState([]);

  const recognitionRef = useRef(null);
  const [audioLevel, setAudioLevel] = useState(Array(15).fill(10));

  useEffect(() => {
    // Populate topics based on track selection
    const track = learningTracks.find(t => t.id === selectedTrack);
    if (track) setTopics(track.modules);
  }, [selectedTrack]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        if (sessionState === 'listening') {
          try {
             recognition.start();
          } catch(e) { } // Ignore if already started
        }
      };
      
      recognitionRef.current = recognition;
    }

    let interval;
    if (sessionState === 'listening' || sessionState === 'speaking') {
      interval = setInterval(() => {
        setAudioLevel(Array(15).fill(0).map(() => Math.floor(Math.random() * 80) + 10));
      }, 100);
    } else {
      setAudioLevel(Array(15).fill(5));
    }
    
    return () => clearInterval(interval);
  }, [sessionState]);

  const speak = (text, onEnd) => {
    setAiSpeech(text);
    setSessionState('speaking');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Siri') || v.lang === 'en-US');
      if (aiVoice) utterance.voice = aiVoice;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => { if (onEnd) onEnd() }, 3000);
    }
  };

  const generateQuestion = async () => {
    setSessionState('evaluating');
    setAiSpeech("Please wait while I generate a relevant interview question...");
    const trackName = learningTracks.find(t => t.id === selectedTrack)?.title || "General Programming";
    const randomTopic = topics[Math.floor(Math.random() * topics.length)] || "Fundamentals";

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "system",
                content: `You are an expert technical interviewer. Ask exactly ONE concise, technical interview question strictly about the topic: "${randomTopic}" from the domain of "${trackName}". Do not include any pleasantries or introductory text. Just the raw question.`
            }],
            temperature: 0.8,
            max_tokens: 100
        })
      });

      const data = await response.json();
      const question = data.choices[0].message.content.trim();
      setCurrentQuestion(question);
      
      setTranscript('');
      setFeedback(null);
      
      speak(`Hello! Let's begin the interview. ${question}`, () => {
        setSessionState('listening');
        if (recognitionRef.current) recognitionRef.current.start();
      });

    } catch(err) {
      console.error("Failed to fetch Groq question", err);
      // Fallback
      setCurrentQuestion("Can you explain what an API is?");
      speak("Can you explain what an API is?", () => {
         setSessionState('listening');
         if (recognitionRef.current) recognitionRef.current.start();
      });
    }
  };

  const stopAnswering = async () => {
    setSessionState('evaluating');
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; 
      recognitionRef.current.stop();
    }

    if (!transcript.trim()) {
       speak("It seems I didn't catch any answer from you. Let's try another question when you're ready.", () => setSessionState('idle'));
       return;
    }

    setAiSpeech("I am analyzing your answer...");

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: `You are an expert AI interviewer.
Question asked: "${currentQuestion}"
User's verbal answer: "${transcript}"

Evaluate the answer. You must output YOUR ENTIRE RESPONSE as a valid minified JSON object with the following exact keys and types:
{
  "score": (integer 0-100 representing overall accuracy),
  "confidence": (integer 0-100 estimating their fluency/confidence based on the text structure),
  "communication": (integer 0-100 evaluating clarity),
  "technical": (integer 0-100 evaluating technical correctness),
  "feedbackText": (string: 2 sentences praising what they got right or addressing specific points made),
  "improvement": (string: 1 sentence on what they failed to mention or how to sound more professional)
}
DO NOT output markdown formatting like \`\`\`json. Output ONLY the raw JSON object.`
                }],
                temperature: 0.3
            })
        });

        const data = await response.json();
        let evalTxt = data.choices[0].message.content.trim();
        if (evalTxt.startsWith('```json')) evalTxt = evalTxt.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const evaluation = JSON.parse(evalTxt);
        setFeedback(evaluation);
        
        speak(`Thank you. I've processed your response. ${evaluation.feedbackText} ${evaluation.improvement}`, () => {
          setSessionState('feedback');
        });

    } catch (err) {
        console.error("Evaluation failed", err);
         const fallback = {
            score: 70, confidence: 80, communication: 75, technical: 70,
            feedbackText: "I had trouble contacting the AI evaluation server, but your answer was recorded.",
            improvement: "Try to ensure your internet connection is stable so I can reach Groq for analysis."
        };
        setFeedback(fallback);
        speak(fallback.feedbackText, () => setSessionState('feedback'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', maxWidth: '1100px', margin: '0 auto', overflow: 'hidden' }}>
      
      <header className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Full-Stack Developer Interview</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Powered by Groq Llama-3.3-70b &bull; AI Evaluator Mode</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
               value={selectedTrack} 
               onChange={(e) => setSelectedTrack(e.target.value)}
               disabled={sessionState !== 'idle' && sessionState !== 'feedback'}
               style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '8px', outline: 'none', cursor: sessionState === 'idle' || sessionState === 'feedback' ? 'pointer' : 'not-allowed' }}
            >
               {learningTracks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
           {sessionState === 'idle' || sessionState === 'feedback' ? (
             <button className="btn btn-primary" onClick={generateQuestion}>
               <Play size={18} /> Start Session
             </button>
           ) : (
             <button className="btn" style={{ background: 'var(--accent)', color: 'white' }} onClick={() => {
                sessionState === 'listening' ? stopAnswering() : window.speechSynthesis.cancel();
                setSessionState('idle');
             }}>
               <Square size={18} /> End Interview
             </button>
           )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.2fr', gap: '2rem', flex: 1, minHeight: 0, paddingBottom: '1rem' }}>
        
        {/* Left Side: Video/Audio Call UI */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, var(--surface) 0%, var(--bg-dark) 100%)' }}>
            
            {/* AI Avatar / Visualizer */}
             <div style={{ 
              width: 160, height: 160, borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: sessionState === 'speaking' ? '0 0 60px rgba(6,182,212,0.6)' : '0 0 20px rgba(0,0,0,0.5)',
              transition: 'all 0.3s ease',
              transform: sessionState === 'speaking' ? 'scale(1.05)' : 'scale(1)',
              marginBottom: '2rem', zIndex: 2
            }}>
              <Video size={60} color="white" />
            </div>

            {/* Audio Waveform */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '60px' }}>
              {audioLevel.map((level, i) => (
                <div key={i} style={{ 
                  width: '6px', 
                  height: `${level}%`, 
                  minHeight: '6px',
                  background: sessionState === 'speaking' ? 'var(--primary)' : sessionState === 'listening' ? 'var(--accent)' : 'var(--border)', 
                  borderRadius: '3px',
                  transition: 'height 0.1s ease',
                  opacity: 0.8
                }}></div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '0 2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: sessionState === 'speaking' ? 'var(--primary)' : 'var(--text-main)' }}>
                {sessionState === 'idle' ? 'AI Interviewer Ready' : 
                 sessionState === 'speaking' ? 'Interviewer is speaking...' : 
                 sessionState === 'listening' ? "It's your turn to speak..." : 
                 sessionState === 'evaluating' ? 'Groq is Analyzing Response...' : 'Feedback Ready'}
              </h3>
              <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                 <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', margin: 0, fontStyle: sessionState === 'speaking' ? 'italic' : 'normal' }}>
                   {sessionState === 'speaking' || sessionState === 'evaluating' ? `"${aiSpeech}"` : currentQuestion ? `Question: ${currentQuestion}` : 'Select a track and press Start Session.'}
                 </p>
              </div>
            </div>
          </div>
          
          {/* User Controls Area */}
          <div style={{ padding: '1.5rem', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: sessionState === 'listening' ? '#10b981' : 'var(--text-muted)' }}>
              {sessionState === 'listening' ? <Mic size={20} /> : <MicOff size={20} />}
              <span>{sessionState === 'listening' ? 'Your Mic is ON' : 'Your Mic is Muted'}</span>
            </div>
            
            {sessionState === 'listening' && (
              <button className="btn" style={{ background: '#10b981', color: 'white', padding: '0.5rem 1.5rem', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }} onClick={stopAnswering}>
                Submit Answer
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Transcript & Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={20} color="var(--primary)" /> Live Transcript
            </h3>
            
            <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', overflowY: 'auto' }}>
              {transcript ? `"${transcript}"` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Your speech will appear here when it's your turn to answer...</span>}
            </div>
          </div>

          {sessionState === 'feedback' && feedback && (
            <div className="glass-card" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out', borderLeft: '4px solid #10b981', flex: 1 }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} color="#10b981" /> Groq AI Evaluation
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>{feedback.confidence}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Confidence</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '4px' }}>{feedback.communication}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Clarity</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>{feedback.technical}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Strengths</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.6 }}>{feedback.feedbackText}</p>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(244,63,94,0.1)', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={18} /> Area for Improvement
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.6 }}>{feedback.improvement}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
