// function makeChunksOfText(text: string): string[] {
//   const maxLength: number = 190;
//   let speechChunks: string[] = [];

//   // Regular expression to match punctuation marks (comma and period)
//   const punctuationRegex = /[,.]/;

//   // Split the text into chunks of maximum length maxLength using punctuation marks
//   while (text.length > 0) {
//       if (text.length <= maxLength) {
//           speechChunks.push(text);
//           break;
//       }

//       let chunk: string = text.substring(0, maxLength + 1);

//       // Find the last punctuation mark in the chunk
//       let lastPunctuationIndex: number = chunk.search(punctuationRegex);

//       if (lastPunctuationIndex !== -1) {
//           // Include the punctuation mark in the current chunk
//           speechChunks.push(text.substring(0, lastPunctuationIndex + 1));
//           text = text.substring(lastPunctuationIndex + 1).trim();
//       } else {
//           // If there are no punctuation marks in the chunk, split at the maxLength
//           speechChunks.push(text.substring(0, maxLength));
//           text = text.substring(maxLength).trim();
//       }
//   }

//   return speechChunks;
// }
  
// function makeChunksOfText(text: string): string[]{
//   const maxLength: number = 190;
//   const punctuationRegex = /[,.]/;
//   let speechChunks: string[] = [];
//   let remainingText = text;

//   while (remainingText.length > maxLength) {
//       let punctuationIndex: number = -1;

//       // Search for the last punctuation mark within maxLength characters
//       for (let i = maxLength; i >= 0; i--) {
//           if (punctuationRegex.test(remainingText[i])) {
//               punctuationIndex = i;
//               break;
//           }
//       }

//       if (punctuationIndex !== -1) {
//           // Include the punctuation mark in the current chunk
//           speechChunks.push(remainingText.substring(0, punctuationIndex + 1));
//           remainingText = remainingText.substring(punctuationIndex + 1).trim();
//       } else {
//           // If no suitable punctuation mark is found, split at maxLength
//           speechChunks.push(remainingText.substring(0, maxLength));
//           remainingText = remainingText.substring(maxLength).trim();
//       }
//   }

//   // Push the remaining text as the last chunk
//   if (remainingText.length > 0) {
//       speechChunks.push(remainingText);
//   }

//   return speechChunks;
// }

function makeChunksOfText(text: string): string[] {
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


async function getGermanVoice(): Promise<SpeechSynthesisVoice> {
  return new Promise(resolve => {
      window.speechSynthesis.onvoiceschanged = () => {
          const germanVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.startsWith('de'));
          resolve(germanVoice || window.speechSynthesis.getVoices()[0]);
      };
  });
}

let cachedVoice: SpeechSynthesisVoice | null = null;

export const speakText = async (text: string): Promise<void> => {
  const speechChunks: string[] = makeChunksOfText(text);
  console.log("speak Text");
  const germanVoice:SpeechSynthesisVoice = cachedVoice || await getGermanVoice();
    if (!germanVoice) {
        console.error('No German voice found.');
        return;
    } else {
      cachedVoice = germanVoice;
      console.log('German voice found.')
    }

  window.speechSynthesis.cancel();
  for (let i = 0; i < speechChunks.length; i++) {
      console.log(speechChunks[i]);
      let speech: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(speechChunks[i]);
      speech.rate = 1.2;
      speech.voice = germanVoice ;
      window.speechSynthesis.speak(speech);
  }
};
  

  