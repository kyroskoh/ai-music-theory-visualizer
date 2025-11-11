# AI Music Theory Visualizer

An interactive web application powered by Google Gemini that brings music theory to life. Visualize scales and chords, generate unique chord progressions, create musically-inspired AI art, and get your theory questions answered by an expert AI chatbot.

## Key Features

*   **Interactive Piano Visualizer**: Enter any scale or chord (e.g., "A minor pentatonic", "F#dim7") and see its notes instantly highlighted on a two-octave piano keyboard.
*   **AI Chord Progression Generator**: Specify a key (e.g., "G Major", "E minor") and let Gemini create a common four-chord progression for you.
*   **Audio Playback**: Listen to your generated chord progressions with a built-in synthesizer, with each chord highlighted on the piano as it plays.
*   **AI Art Generation**: Create stunning, abstract images inspired by your musical selections. The app generates a creative prompt based on the visualized scale or progression, which you can use to generate art with Imagen.
*   **Music Theory Chatbot**: Have a question about modes, circle of fifths, or anything else music-related? Ask the friendly AI assistant and get clear, concise answers in real-time.
*   **Sleek & Responsive UI**: A modern and intuitive interface built with Tailwind CSS that works beautifully on any device.

## How to Use

1.  **Visualize a Scale/Chord**:
    *   Select the "Single Element" tab in the Controls panel.
    *   Type your request into the input field (e.g., "C Lydian scale").
    *   Click "Visualize" to see the notes on the piano.

2.  **Generate a Chord Progression**:
    *   Select the "Progression Generator" tab.
    *   Enter a key (e.g., "Bb Major").
    *   Click "Generate" to get a four-chord progression.
    *   Click on individual chord buttons to see their notes, or press "Play" to hear the whole sequence.

3.  **Create AI Art**:
    *   After visualizing a scale or progression, a relevant prompt will appear in the "Generate Musical Art" section.
    *   You can modify the prompt if you wish.
    *   Click "Generate" to create your image.

4.  **Chat with the AI**:
    *   Use the "Theory Chatbot" panel on the left.
    *   Type your question in the input box at the bottom and press Enter or the send button.

## Technologies Used

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI & Machine Learning**:
    *   **Google Gemini Flash**: For parsing music requests, generating chord progressions, and powering the chatbot.
    *   **Google Imagen**: For generating high-quality images.
*   **Audio**: Web Audio API for synthesizing sounds.
