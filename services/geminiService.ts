
import { GoogleGenAI, Type, Chat } from '@google/genai';
import type { MusicTheoryInfo, ChordProgression } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const noteSchema = {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The note name, e.g., 'C', 'D#', 'Fb'.",
      },
      octave: {
        type: Type.INTEGER,
        description: 'The octave number for the note (e.g., 4 for middle C).',
      },
    },
    required: ['name', 'octave'],
};

const musicSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: ['scale', 'chord'],
      description: 'The type of musical element.'
    },
    name: {
        type: Type.STRING,
        description: 'The full name of the scale or chord, e.g., "C Major Scale" or "G Dominant 7th".',
    },
    rootNote: {
      type: Type.STRING,
      description: "The root note, e.g., 'C', 'G#', 'Bb'.",
    },
    quality: {
      type: Type.STRING,
      description: "The quality of the scale or chord, e.g., 'Major', 'minor pentatonic', 'Dominant 7th'.",
    },
    notes: {
      type: Type.ARRAY,
      description: 'An array of notes in the scale or chord.',
      items: noteSchema,
    },
  },
  required: ['type', 'name', 'rootNote', 'quality', 'notes'],
};

const chordProgressionSchema = {
    type: Type.ARRAY,
    description: "A sequence of chords forming a progression.",
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the chord, e.g., "C Major" or "G7".'
            },
            notes: {
                type: Type.ARRAY,
                description: "The notes that make up the chord.",
                items: noteSchema,
            },
        },
        required: ['name', 'notes'],
    }
};

export async function parseMusicRequest(request: string): Promise<MusicTheoryInfo | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Parse the following music theory request and provide the details. The first note should be in the 4th octave. Subsequent notes should ascend. Request: "${request}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: musicSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed as MusicTheoryInfo;
  } catch (error) {
    console.error('Error parsing music request:', error);
    return null;
  }
}

export async function generateChordProgression(request: string): Promise<ChordProgression | null> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a common, 4-chord progression for the key of "${request}". The first note of each chord should be in the 4th octave.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: chordProgressionSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as ChordProgression;
    } catch (error) {
        console.error('Error generating chord progression:', error);
        return null;
    }
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/jpeg',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } else {
    throw new Error('Image generation failed to produce an image.');
  }
}

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a friendly and knowledgeable music theory expert. Keep your answers concise and helpful.',
    },
  });
  return chat;
}
