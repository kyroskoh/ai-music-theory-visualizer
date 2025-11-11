
import React, { useState, useEffect } from 'react';
import type { MusicTheoryInfo } from '../types';
import { SparklesIcon, SearchIcon } from './icons';

interface ControlsPanelProps {
  onVisualize: (request: string) => void;
  onGenerateImage: (prompt: string) => void;
  isLoading: boolean;
  visualizationInfo: MusicTheoryInfo | null;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ onVisualize, onGenerateImage, isLoading, visualizationInfo }) => {
  const [musicRequest, setMusicRequest] = useState('C Major Scale');
  const [imagePrompt, setImagePrompt] = useState('');

  useEffect(() => {
    if (visualizationInfo) {
      setImagePrompt(`A beautiful abstract visualization of the ${visualizationInfo.name}.`);
    } else {
      setImagePrompt('');
    }
  }, [visualizationInfo]);
  
  const handleVisualizeClick = () => {
    if (musicRequest.trim()) {
      onVisualize(musicRequest);
    }
  };

  const handleGenerateClick = () => {
    if (imagePrompt.trim()) {
      onGenerateImage(imagePrompt);
    }
  };
  
  const handleMusicRequestKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVisualizeClick();
    }
  };

  return (
    <div className="bg-gray-800/50 ring-1 ring-white/10 rounded-lg shadow-xl p-4 md:p-6 space-y-6">
      <div className="space-y-3">
        <label htmlFor="music-request" className="block text-lg font-semibold text-white">1. Visualize a Scale or Chord</label>
        <div className="flex gap-2">
          <input
            id="music-request"
            type="text"
            value={musicRequest}
            onChange={(e) => setMusicRequest(e.target.value)}
            onKeyPress={handleMusicRequestKeyPress}
            placeholder="e.g., A minor pentatonic, F#dim7"
            className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleVisualizeClick}
            disabled={isLoading || !musicRequest.trim()}
            className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition-all duration-200"
          >
            <SearchIcon className="w-5 h-5"/>
            Visualize
          </button>
        </div>
      </div>

      <div className="border-t border-gray-700"></div>

      <div className="space-y-3">
        <label htmlFor="image-prompt" className="block text-lg font-semibold text-white">2. Generate Musical Art</label>
        <div className="flex gap-2">
          <input
            id="image-prompt"
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe an image..."
            className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading || !visualizationInfo}
          />
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !imagePrompt.trim() || !visualizationInfo}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition-all duration-200"
          >
            <SparklesIcon className="w-5 h-5"/>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
