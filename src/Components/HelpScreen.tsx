import React from "react";

interface HelpScreenProps {
  onClose: () => void;
}

function HelpScreen({ onClose }: HelpScreenProps) {
  return (
    <div className="fixed top-10 left-1/10 w-4/5  flex items-left justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-blue-300 p-6 rounded-lg shadow-xl">
        <p className="text-sm text-black text-left">
          <b>
            Welcome to fachAI! You will be talking to an AI patient with a
            specific disease. Please try to diagnose him. Good luck!{" "}
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
          Speed 🔽/🔼: increase or decrease AI speaking speed <br />
          ⏸️: stop AI speaking <br />
          👁️: hide AI text <br />
          🔄: reset session with a new disease <br />
          ☕: Buy me a{" "}
          <a className="text-blue-800" href="http://www.buymeacoffee.com">
            coffee
          </a>{" "}
          to support me with my work.
          <br />
          <br />
          <b>System Requirements:</b>
          <br />
          <b>Google Chrome on desktop</b> for best results. Also support Safari
          14.1 and Microsoft Edge and other browsers that support Web Speech
          API.
          <br />
          For <b>Android chrome</b>, you might need to update your Google
          Text-to-Speech function. Go to{" "}
          <b>Settings - Languages & Input - Text-to-Speech output</b>. Make sure
          the corresponding TTS voice for your practice language is installed
          there. You might need to restart your phone upon change.
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
