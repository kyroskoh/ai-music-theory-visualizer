
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { AppState, MusicTheoryInfo, ChordProgression } from '../types';
import { MusicNoteIcon, ImageIcon, AlertTriangleIcon, LoadingSpinner, PlayIcon, StopIcon } from './icons';
import { playProgression, stopAllAudio, getAudioContext } from '../utils/audio';

interface VisualizationPanelProps {
  appState: AppState;
  visualizationInfo: MusicTheoryInfo | null;
  progression: ChordProgression | null;
  generatedImage: string | null;
  error: string | null;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  appState,
  visualizationInfo,
  progression,
  generatedImage,
  error,
}) => {
  const [activeChordIndex, setActiveChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setActiveChordIndex(0);
    stopAllAudio(audioContextRef.current);
    setIsPlaying(false);
  }, [progression, visualizationInfo, generatedImage, error]);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
        stopAllAudio(audioContextRef.current);
    };
  }, []);

  const handlePlayProgression = useCallback(() => {
    if (!progression) return;

    if (isPlaying) {
        stopAllAudio(audioContextRef.current);
        setIsPlaying(false);
        return;
    }
    
    audioContextRef.current = getAudioContext();
    setIsPlaying(true);
    playProgression(
      progression,
      audioContextRef.current,
      120, // tempo
      (index) => setActiveChordIndex(index), // onNoteChange
      () => setIsPlaying(false) // onFinish
    );
  }, [progression, isPlaying]);

  const renderContent = () => {
    if (appState === AppState.Error && error) {
      return (
        <div className="text-center text-red-400 flex flex-col items-center justify-center gap-4">
          <AlertTriangleIcon className="w-12 h-12" />
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p className="text-red-300">{error}</p>
        </div>
      );
    }
    
    const loadingStates: Partial<Record<AppState, string>> = {
      [AppState.Visualizing]: 'Analyzing music theory...',
      [AppState.GeneratingProgression]: 'Generating chord progression...',
      [AppState.GeneratingImage]: 'Generating musical artwork...',
    };
    
    if (loadingStates[appState]) {
      return (
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <LoadingSpinner className="w-12 h-12" />
          <p className="text-lg text-gray-400 animate-pulse">{loadingStates[appState]}</p>
        </div>
      );
    }

    if (generatedImage) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                 <img src={generatedImage} alt="Generated art" className="object-contain w-full h-full rounded-lg" />
            </div>
        )
    }

    if (progression) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-cyan-300">Chord Progression</h3>
                    <button 
                        onClick={handlePlayProgression}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                    >
                        {isPlaying ? <StopIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                        {isPlaying ? 'Stop' : 'Play'}
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {progression.map((chord, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveChordIndex(index)}
                            className={`px-4 py-2 rounded-md transition-all duration-200 ${activeChordIndex === index ? 'bg-cyan-500 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {chord.name}
                        </button>
                    ))}
                </div>
                <PianoKeyboard highlightedNotes={progression[activeChordIndex]?.notes || []} />
            </div>
        )
    }

    if (visualizationInfo) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h3 className="text-2xl font-bold mb-2 text-cyan-300">{visualizationInfo.name}</h3>
            <p className="text-gray-400 mb-4">Notes: {visualizationInfo.notes.map(n => n.name).join(', ')}</p>
            <PianoKeyboard highlightedNotes={visualizationInfo.notes} />
        </div>
      );
    }

    return (
      <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-4">
        <MusicNoteIcon className="w-16 h-16" />
        <h3 className="text-xl font-semibold">Music & Art Awaits</h3>
        <p>Use the controls below to visualize a scale or chord.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 ring-1 ring-white/10 rounded-lg shadow-xl flex-grow flex items-center justify-center p-4 min-h-[400px]">
      {renderContent()}
    </div>
  );
};

export default VisualizationPanel;
