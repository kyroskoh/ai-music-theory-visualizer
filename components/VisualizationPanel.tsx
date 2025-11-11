
import React from 'react';
import PianoKeyboard from './PianoKeyboard';
import { AppState, MusicTheoryInfo } from '../types';
import { MusicNoteIcon, ImageIcon, AlertTriangleIcon, LoadingSpinner } from './icons';

interface VisualizationPanelProps {
  appState: AppState;
  visualizationInfo: MusicTheoryInfo | null;
  generatedImage: string | null;
  error: string | null;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  appState,
  visualizationInfo,
  generatedImage,
  error,
}) => {
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
    
    if (appState === AppState.Visualizing) {
      return (
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <LoadingSpinner className="w-12 h-12" />
          <p className="text-lg text-gray-400 animate-pulse">Analyzing music theory...</p>
        </div>
      );
    }

    if (appState === AppState.GeneratingImage) {
      return (
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <LoadingSpinner className="w-12 h-12" />
          <p className="text-lg text-gray-400 animate-pulse">Generating musical artwork...</p>
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
