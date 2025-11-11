
import React from 'react';
import type { Note } from '../types';

interface PianoKeyboardProps {
  highlightedNotes: Note[];
}

const whiteKeyWidth = 40;
const blackKeyWidth = 24;
const whiteKeyHeight = 180;
const blackKeyHeight = 110;

const pianoKeys = [
  { name: 'C', black: false, noteNames: ['C'] },
  { name: 'C#', black: true, noteNames: ['C#', 'Db'] },
  { name: 'D', black: false, noteNames: ['D'] },
  { name: 'D#', black: true, noteNames: ['D#', 'Eb'] },
  { name: 'E', black: false, noteNames: ['E'] },
  { name: 'F', black: false, noteNames: ['F'] },
  { name: 'F#', black: true, noteNames: ['F#', 'Gb'] },
  { name: 'G', black: false, noteNames: ['G'] },
  { name: 'G#', black: true, noteNames: ['G#', 'Ab'] },
  { name: 'A', black: false, noteNames: ['A'] },
  { name: 'A#', black: true, noteNames: ['A#', 'Bb'] },
  { name: 'B', black: false, noteNames: ['B'] },
];

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ highlightedNotes }) => {
  const noteSet = new Set(highlightedNotes.map(n => n.name.toUpperCase()));

  const renderKeys = (octave: number) => {
    let x = 0;
    const keys = [];
    // White keys first
    for (const key of pianoKeys.filter(k => !k.black)) {
      const isHighlighted = key.noteNames.some(n => noteSet.has(n.toUpperCase()));
      keys.push(
        <rect
          key={`${key.name}${octave}-white`}
          x={x}
          y={0}
          width={whiteKeyWidth}
          height={whiteKeyHeight}
          fill={isHighlighted ? 'rgb(34 211 238)' : 'white'}
          stroke="black"
          rx="2"
          ry="2"
          className="transition-fill duration-300"
        />
      );
      x += whiteKeyWidth;
    }
    // Black keys on top
    x = 0;
    for (const key of pianoKeys) {
        if (!key.black) {
             x += whiteKeyWidth;
        } else {
            const isHighlighted = key.noteNames.some(n => noteSet.has(n.toUpperCase()));
            keys.push(
                <rect
                    key={`${key.name}${octave}-black`}
                    x={x - blackKeyWidth / 2}
                    y={0}
                    width={blackKeyWidth}
                    height={blackKeyHeight}
                    fill={isHighlighted ? 'rgb(34 211 238)' : 'black'}
                    stroke="black"
                    rx="2"
                    ry="2"
                    className="transition-fill duration-300"
                />
            );
        }
    }

    return keys;
  };

  const numWhiteKeys = pianoKeys.filter(k => !k.black).length * 2;
  const totalWidth = numWhiteKeys * whiteKeyWidth;

  return (
    <div className="w-full flex justify-center p-4">
      <svg
        viewBox={`-1 -1 ${totalWidth + 2} ${whiteKeyHeight + 2}`}
        preserveAspectRatio="xMidYMid meet"
        className="max-w-full"
      >
        <g>{renderKeys(4)}</g>
        <g transform={`translate(${pianoKeys.filter(k => !k.black).length * whiteKeyWidth}, 0)`}>{renderKeys(5)}</g>
      </svg>
    </div>
  );
};

export default PianoKeyboard;
