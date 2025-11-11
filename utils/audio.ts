
import type { Note, Chord, ChordProgression } from '../types';

let audioContext: AudioContext | null = null;
let activeSources: (OscillatorNode | GainNode)[] = [];

const noteFrequencies: { [key: string]: number } = {
    'C': 261.63, 'C#': 277.18, 'Db': 277.18, 'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'Gb': 369.99, 'G': 392.00, 'G#': 415.30,
    'Ab': 415.30, 'A': 440.00, 'A#': 466.16, 'Bb': 466.16, 'B': 493.88,
};

function getNoteFrequency(note: Note): number {
    const baseFrequency = noteFrequencies[note.name.toUpperCase()];
    if (!baseFrequency) return 0;
    return baseFrequency * Math.pow(2, note.octave - 4);
}

export function getAudioContext(): AudioContext {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
}

export function stopAllAudio(ctx: AudioContext | null) {
    activeSources.forEach(source => {
        if (source instanceof OscillatorNode) {
            source.stop();
        }
        source.disconnect();
    });
    activeSources = [];
}

function playChord(chord: Chord, ctx: AudioContext, startTime: number, duration: number) {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02); // Quick attack
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Decay
    masterGain.connect(ctx.destination);
    activeSources.push(masterGain);

    chord.notes.forEach(note => {
        const freq = getNoteFrequency(note);
        if (freq > 0) {
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.connect(masterGain);
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
            activeSources.push(oscillator);
        }
    });
}

export function playProgression(
    progression: ChordProgression,
    ctx: AudioContext,
    tempo: number,
    onNoteChange: (index: number) => void,
    onFinish: () => void,
) {
    stopAllAudio(ctx);

    const secondsPerBeat = 60.0 / tempo;
    const chordDuration = secondsPerBeat * 4; // Assuming 4 beats per chord
    let currentTime = ctx.currentTime + 0.1; // Start with a small delay

    progression.forEach((chord, index) => {
        setTimeout(() => onNoteChange(index), (currentTime - ctx.currentTime + (index * chordDuration)) * 1000);
        playChord(chord, ctx, currentTime + (index * chordDuration), chordDuration * 0.9);
    });

    const totalDuration = progression.length * chordDuration;
    setTimeout(() => {
        onFinish();
        stopAllAudio(ctx);
    }, (totalDuration + 0.1) * 1000);
}
