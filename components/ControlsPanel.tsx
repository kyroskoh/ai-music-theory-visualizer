
import React, { useState, useEffect } from 'react';
import type { MusicTheoryInfo, ChordProgression } from '../types';
import { SparklesIcon, SearchIcon, MusicNoteIcon } from './icons';

interface ControlsPanelProps {
  onVisualize: (request: string) => void;
  onGenerateProgression: (request: string) => void;
  onGenerateImage: (prompt: string) => void;
  isLoading: boolean;
  visualizationInfo: MusicTheoryInfo | null;
  progression: ChordProgression | null;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ 
    onVisualize, 
    onGenerateProgression, 
    onGenerateImage, 
    isLoading, 
    visualizationInfo,
    progression 
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'progression'>('single');
  const [musicRequest, setMusicRequest] = useState('C Major Scale');
  const [progressionRequest, setProgressionRequest] = useState('C Major');
  const [imagePrompt, setImagePrompt] = useState('');

  useEffect(() => {
    if (progression) {
      const progressionName = progression.map(c => c.name).join(' - ');
      setImagePrompt(`A beautiful abstract visualization of a ${progressionName} chord progression.`);
    } else if (visualizationInfo) {
      setImagePrompt(`A beautiful abstract visualization of the ${visualizationInfo.name}.`);
    } else {
      setImagePrompt('');
    }
  }, [visualizationInfo, progression]);
  
  const handleVisualizeClick = () => {
    if (musicRequest.trim()) {
      onVisualize(musicRequest);
    }
  };

  const handleGenerateProgressionClick = () => {
    if (progressionRequest.trim()) {
      onGenerateProgression(progressionRequest);
    }
  };

  const handleGenerateClick = () => {
    if (imagePrompt.trim()) {
      onGenerateImage(imagePrompt);
    }
  };
  
  const handleMusicRequestKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleVisualizeClick();
  };
  
  const handleProgressionRequestKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleGenerateProgressionClick();
  };

  const TabButton: React.FC<{tabName: 'single' | 'progression', label: string}> = ({tabName, label}) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="bg-gray-800/50 ring-1 ring-white/10 rounded-lg shadow-xl p-4 md:p-6 space-y-6">
      
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">Controls</h2>
        <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg">
            <TabButton tabName="single" label="Single Element" />
            <TabButton tabName="progression" label="Progression Generator" />
        </div>
      </div>

      {activeTab === 'single' && (
        <div className="space-y-3 animate-fade-in">
          <label htmlFor="music-request" className="block text-md font-semibold text-gray-300">Visualize a Scale or Chord</label>
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
      )}

      {activeTab === 'progression' && (
        <div className="space-y-3 animate-fade-in">
          <label htmlFor="progression-request" className="block text-md font-semibold text-gray-300">Generate a Chord Progression</label>
          <div className="flex gap-2">
            <input
              id="progression-request"
              type="text"
              value={progressionRequest}
              onChange={(e) => setProgressionRequest(e.target.value)}
              onKeyPress={handleProgressionRequestKeyPress}
              placeholder="e.g., C Major, A minor"
              className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateProgressionClick}
              disabled={isLoading || !progressionRequest.trim()}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md transition-all duration-200"
            >
              <MusicNoteIcon className="w-5 h-5"/>
              Generate
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-700"></div>

      <div className="space-y-3">
        <label htmlFor="image-prompt" className="block text-lg font-semibold text-white">Generate Musical Art</label>
        <div className="flex gap-2">
          <input
            id="image-prompt"
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe an image..."
            className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading || (!visualizationInfo && !progression)}
          />
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !imagePrompt.trim() || (!visualizationInfo && !progression)}
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
