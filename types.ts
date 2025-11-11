
export interface Note {
  name: string;
  octave: number;
}

export interface MusicTheoryInfo {
  type: 'scale' | 'chord';
  name: string;
  rootNote: string;
  quality: string;
  notes: Note[];
}

export interface Chord {
    name: string;
    notes: Note[];
}

export type ChordProgression = Chord[];

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export enum AppState {
  Ready = 'ready',
  Visualizing = 'visualizing',
  GeneratingProgression = 'generating-progression',
  GeneratingImage = 'generating-image',
  Error = 'error',
}
