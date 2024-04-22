import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
  speakText: (text: string, speed?: number) => Promise<void>;
  hasLangVoice: boolean | null;
  stopText: () => Promise<void>;
  isSpeakingText: boolean;
}

function useTextToSpeech(language: string): TextToSpeechHook {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [hasLangVoice, sethasLangVoice] = useState<boolean | null>(null);
  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);

  async function makeChunksOfText(text: string): Promise<string[]> {
    const maxLength: number = 190;
    const periodRegex = /\./;
    const commaRegex = /,/;
    let speechChunks: string[] = [];
    let remainingText = text;

    while (remainingText.length > maxLength) {
      let chunk: string = remainingText.substring(0, maxLength + 1);
      let periodIndex: number = chunk.search(periodRegex);
      let commaIndex: number = chunk.search(commaRegex);

      if (periodIndex !== -1 && periodIndex < maxLength) {
        // Include the period in the current chunk
        speechChunks.push(remainingText.substring(0, periodIndex + 1));
        remainingText = remainingText.substring(periodIndex + 1).trim();
      } else if (commaIndex !== -1 && commaIndex < maxLength) {
        // Include the comma in the current chunk
        speechChunks.push(remainingText.substring(0, commaIndex + 1));
        remainingText = remainingText.substring(commaIndex + 1).trim();
      } else {
        // If neither a period nor a comma is found within maxLength,
        // split the text at maxLength
        let chunkEndIndex = maxLength;
        // Find the last space before the maxLength to avoid splitting words
        while (chunkEndIndex >= 0 && remainingText[chunkEndIndex] !== ' ') {
          chunkEndIndex--;
        }
        if (chunkEndIndex > 0) {
          speechChunks.push(remainingText.substring(0, chunkEndIndex));
          remainingText = remainingText.substring(chunkEndIndex + 1).trim();
        } else {
          // If there's no space before maxLength, split at maxLength
          speechChunks.push(remainingText.substring(0, maxLength));
          remainingText = remainingText.substring(maxLength).trim();
        }
      }
    }
    if (remainingText.length > 0) {
      speechChunks.push(remainingText);
    }
    return speechChunks;
  }

  const getVoice = useCallback(async (language: string) => {
    let lang: string;
    switch (language.toLowerCase()) {
      case "english":
        lang = "en";
        break;
      case "german":
        lang = "de";
        break;
      case "spanish":
        lang = "es";
        break;
      case "french":
        lang = "fr";
        break;
      default:
        lang = "de"; // Default to English
        break;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      findVoice(lang);
    };

    findVoice(lang);
  }, []);

  const findVoice = (lang: string) => {
    const voice = window.speechSynthesis.getVoices().find(voice => voice.lang.startsWith(lang));
    if (voice) {
      setVoice(voice);
      sethasLangVoice(true);
    } else {
      setVoice(window.speechSynthesis.getVoices()[0]);
      sethasLangVoice(false);
    }
  }

  async function speakText(text: string, speed?: number): Promise<void> {
    const speechChunks: string[] = await makeChunksOfText(text);

    window.speechSynthesis.cancel();
    for (let i = 0; i < speechChunks.length; i++) {
      let speech: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(speechChunks[i]);
      speech.rate = speed || 1;
      speech.voice = voice;
      speech.onstart = () => setIsSpeakingText(true);
      speech.onpause = () => setIsSpeakingText(false);
      speech.onerror = () => setIsSpeakingText(false);
      speech.onend = () => setIsSpeakingText(false);
      window.speechSynthesis.speak(speech);
    }
  }

  async function stopText(): Promise<void> {
    window.speechSynthesis.cancel();
  }

  useEffect(() => {
    getVoice(language);
    

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [getVoice, language]);

  return { speakText, hasLangVoice, stopText, isSpeakingText };
}

export default useTextToSpeech;