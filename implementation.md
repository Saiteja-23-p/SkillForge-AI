# SkillForge AI Learning Platform

SkillForge AI is an advanced, AI-powered educational platform designed to guide students from foundational programming concepts all the way to job interview readiness. It features structured learning paths, dynamic AI mentorship, and a real-time speech-enabled mock interview system powered by Llama 3.

## 🚀 Key Features

*   **10 Comprehensive Learning Tracks:** Ranging from Programming Fundamentals and DSA to System Design, AI/ML, and Interview Preparation.
*   **Structured Modules & Paths:** Each track is broken down into modules containing video overviews, reading materials, interactive coding practice, and quizzes.
*   **Real-time AI Mentor Chatbot:** Utilizing the **Groq API** (Llama-3.3-70b-versatile), the chatbot remembers conversation context, explains complex topics, and provides ATS-friendly resume advice or tailored code snippets dynamically.
*   **AI Mock Interview System:** 
    *   Uses the browser's **Web Speech API** for real-time speech-to-text input and text-to-speech AI voice output.
    *   Dynamically queries Llama-3 to generate interview questions specific to the user's selected learning track.
    *   Transcribes the user's spoken answer and feeds it to Groq for automated json evaluation based on Confidence, Clarity, and Technical Accuracy.
*   **Premium Gamified UI:** Built with dark-mode glassmorphism aesthetics, fluid transitions, and a responsive sidebar layout.

---

## 🛠 Technology Stack

### Frontend & Core
*   **React 18:** Component-based UI architecture.
*   **Vite:** Ultra-fast modern frontend build tool.
*   **Vanilla CSS:** Custom CSS variables for reliable theming, CSS grid/flexbox for layouts, and keyframe animations for the UI.
*   **Lucide-React:** Clean, customizable SVG icons.

### Artificial Intelligence & APIs
*   **Groq API (Llama-3.3-70b-versatile):** The "brain" of the platform. Used directly via HTTP fetch requests for conversational chatbot data and complex JSON grading parsing for interviews.
*   **Web Speech API:** Native browser API (`SpeechRecognition` and `speechSynthesis`) used for recording microphone audio continuously and generating responsive synthetic voice read-outs.

---

## ⚙️ How to Run Locally

If you are cloning this project or moving it to another device, follow these exact steps:

### Prerequisites
Make sure you have Node.js installed (v16.0 or higher recommended). You can verify this by running `node -v` in your terminal.

### 1. Installation
Open a terminal in the project root directory (the folder containing `package.json`) and run:
```bash
npm install
```
*Note: This will install Vite, React, Lucide-icons, and any other required dependencies.*

### 2. Configure Environment Variables
The application natively queries the Groq API. Ensure you have your `GROQ_API_KEY` correctly configured inside the component logic or within an environment file (`.env`) if you shift to a production backend architecture later:
*   `src/components/Chatbot.jsx`
*   `src/components/MockInterview.jsx`

### 3. Start the Development Server
Run the local Vite development server:
```bash
npm run dev
```

### 4. Open in Browser
Once the server starts, it will output a local network URL, typically:
`http://localhost:5173`
Open this URL in Google Chrome or Microsoft Edge (Safari does not fully support the Web Speech API standards at this time).

---

## 📂 Project Architecture

The `src` directory holds the core logic:

*   **`components/`**: Houses all the React views.
    *   `Sidebar.jsx`: The left navigation pane handling route state.
    *   `Dashboard.jsx`: The home screen displaying XP and recommended learning paths.
    *   `LearningModule.jsx`: A deeply nested dynamic viewer that renders Tracks > Modules > Sub-Paths using the data model.
    *   `Chatbot.jsx`: The Groq-powered chat interface overlay.
    *   `MockInterview.jsx`: The dedicated component handling the `onresult` speech streams, the audio waveform visualizer, and the Groq json evaluator.
*   **`data/`**: 
    *   `learningPaths.js`: The central JSON-like database of arrays holding all 10 tracks and their nested lesson structures. Changing this file immediately updates the UI.
*   **`index.css`**: The core styling architecture featuring all `:root` CSS variables and `.glass-card` utilities utilized platform-wide.
