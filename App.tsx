
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import ChatPanel from './components/ChatPanel';
import ControlsPanel from './components/ControlsPanel';
import VisualizationPanel from './components/VisualizationPanel';
import { MusicTheoryInfo, ChatMessage, AppState, ChordProgression } from './types';
import { 
  parseMusicRequest, 
  generateImage, 
  createChatSession,
  generateChordProgression
} from './services/geminiService';
import { MusicNoteIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Ready);
  const [visualizationInfo, setVisualizationInfo] = useState<MusicTheoryInfo | null>(null);
  const [progression, setProgression] = useState<ChordProgression | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
    setChatMessages([{
      sender: 'bot',
      text: "Hello! I'm your music theory assistant. Ask me anything about music, or use the controls to visualize scales, chords, and progressions.",
    }]);
  }, []);

  const clearVisualizations = () => {
    setVisualizationInfo(null);
    setProgression(null);
    setGeneratedImage(null);
    setError(null);
  }

  const handleVisualize = useCallback(async (request: string) => {
    setAppState(AppState.Visualizing);
    clearVisualizations();
    try {
      const result = await parseMusicRequest(request);
      if (result) {
        setVisualizationInfo(result);
        setAppState(AppState.Ready);
      } else {
        throw new Error("Could not understand the music request. Try something like 'C major scale' or 'G7 chord'.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during visualization.';
      console.error(errorMessage);
      setError(errorMessage);
      setAppState(AppState.Error);
    }
  }, []);

  const handleGenerateProgression = useCallback(async (request: string) => {
    setAppState(AppState.GeneratingProgression);
    clearVisualizations();
    try {
      const result = await generateChordProgression(request);
      if (result && result.length > 0) {
        setProgression(result);
        setAppState(AppState.Ready);
      } else {
        throw new Error("Could not generate a progression. Try a key like 'C Major' or 'A minor'.");
      }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during progression generation.';
        console.error(errorMessage);
        setError(errorMessage);
        setAppState(AppState.Error);
    }
  }, []);

  const handleGenerateImage = useCallback(async (prompt: string) => {
    setAppState(AppState.GeneratingImage);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);
      setAppState(AppState.Ready);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while generating the image.';
      console.error(errorMessage);
      setError(errorMessage);
      setAppState(AppState.Error);
    }
  }, []);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatRef.current) return;

    setIsChatLoading(true);
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    let currentBotMessage = '';
    setChatMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message });

      for await (const chunk of stream) {
        currentBotMessage += chunk.text;
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentBotMessage;
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to get a response.';
      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = `Error: ${errorMessage}`;
        return newMessages;
      });
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-center">
          <MusicNoteIcon className="h-8 w-8 text-cyan-400 mr-3" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Gemini Music Theory Visualizer
          </h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-4 h-[60vh] lg:h-auto flex flex-col">
          <ChatPanel 
            messages={chatMessages} 
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading} 
          />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            <VisualizationPanel
              appState={appState}
              visualizationInfo={visualizationInfo}
              progression={progression}
              generatedImage={generatedImage}
              error={error}
            />
            <ControlsPanel
              onVisualize={handleVisualize}
              onGenerateProgression={handleGenerateProgression}
              onGenerateImage={handleGenerateImage}
              isLoading={appState === AppState.Visualizing || appState === AppState.GeneratingImage || appState === AppState.GeneratingProgression}
              visualizationInfo={visualizationInfo}
              progression={progression}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
