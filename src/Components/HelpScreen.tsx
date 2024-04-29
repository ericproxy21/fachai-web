import React, { useState } from "react";

interface HelpScreenProps {
  onClose: () => void;
}

function HelpScreen({ onClose }: HelpScreenProps) {
  const [expandedAndroid, setExpandedAndroid] = useState(false);
  const [expandediOS, setExpandediOS] = useState(false);
  const toggleExpandAndroid = () => {
    setExpandedAndroid(!expandedAndroid);
    setExpandediOS(false);
  };
  const toggleExpandiOS = () => {
    setExpandediOS(!expandediOS);
    setExpandedAndroid(false);
  };
  return (
    <div className="fixed top-10 left-1/10 w-4/5  flex items-left justify-center bg-gray-500 bg-opacity-50 z-100 ">
      <div className="bg-blue-300 p-6 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-sm text-black text-left">
          <b>
            Welcome to fachAI! You will be talking to an AI patient with a
            specific disease. Please try to diagnose him/her. Good luck!{" "}
          </b>
          <br />
          1. You can either speak or type. Press the microphone button to start
          and stop recording.
          <br />
          2. When you are done, click the button "Evaluate".
          <br />
          3. You can change your training language on the language dropdown in
          top right corner.
          <br />
          <br />
          🔽/🔼: adjust AI speaking speed <br />
          ⏸️: stop AI speaking <br />
          👁️: hide AI text <br />
          🔄: reset session with a new disease <br />
          ☕: Buy me a{" "}
          <a
            className="text-blue-800"
            target="_blank"
            href="https://buymeacoffee.com/fachai"
            rel="noreferrer"
          >
            coffee
          </a>{" "}
          to support me with my work.
          <br />
          <br />
          <b>
            <span>System Requirements:</span>
          </b>
          <br />
          Use <b>Google Chrome on desktop</b> for best results. Also support
          Safari 14.1 and Microsoft Edge.
          <br />
          <span
            onClick={toggleExpandAndroid}
            className="text-blue-800 underline"
          >
            Android
          </span>
          <span
            onClick={toggleExpandiOS}
            className="text-blue-800 underline ml-3"
          >
            iOS
          </span>
          <br />
          {expandedAndroid && (
            <span>
              To the right of the address bar, tap More (triple dots) - Settings
              - Microphone to turn the camera on.
              <br />
              You might need to update your Google Text-to-Speech language. Go
              to{" "}
              <b>
                Settings - Languages & Input - Text-to-Speech output - Language
              </b>{" "}
              to select the practice language. Make sure the TTS voice for your
              practice language is installed in <b>Install Voice Data</b>. You
              might need to restart your phone for the changes to take effect.
              <br />
            </span>
          )}
          {expandediOS && (
            <span>
              Check camera access is enabled in{" "}
              <b>Settings - Chrome - Microphone</b>.
            </span>
          )}
          <br />
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default HelpScreen;
