import React, { useState, useRef, useEffect, useCallback } from "react";
import { chat } from "../api/fachai";
import logo from "./logo.svg";
import { ROLE, Message } from "../Types/common";
import SpeedAdjuster from "./SpeedAdjuster";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useTextToSpeech from "../hooks/useTextToSpeech";

const Chatbox: React.FC = () => {
  const commands = [
    {
      command: "evaluate",
      callback: () => evaluateSession(),
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands });
  const { speakText, hasGermanVoice } = useTextToSpeech();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [speed, setSpeed] = useState(1.2);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    fetchResponse(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const fetchResponse = useCallback(
    (msg: string) => {
      console.log("Fetch Response...");
      msg = msg.trim();
      if (msg.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: ROLE.User, content: msg },
        ]);
        setLoading(true);

        chat(msg).then((res: string) => {
          console.log("chatgpt API call result: ", res);

          if (res) {
            // To cancel the timer and reset it
            speakText(res, speed);
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: ROLE.Assistant, content: res },
            ]);
            setInputValue("");
          } else {
            //Alert.alert('Error', res.data as unknown as string);
          }

          setLoading(false);
        });
      }
    },
    [setMessages, setLoading, speed, setInputValue, speakText]
  );

  const startSpeaking = () => {};
  const stopSpeaking = () => {};

  const startRecording = () => {
    console.log("start recording");
    resetTranscript();
    SpeechRecognition.startListening(); //{ language: 'zh-CN' }
    while (listening) {}
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    // fetchResponse(transcript);
  };
  const clearMessageHistory = () => {};
  const evaluateSession = () => {
    clearMessageHistory();
  };

  // Scroll to the bottom of the chat history when messages change
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
    if (!listening && transcript !== "") {
      fetchResponse(transcript);
      resetTranscript();
    }
  }, [messages, listening, transcript, fetchResponse, resetTranscript]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={historyRef}
        className="overflow-y-auto flex-grow border border-gray-300 p-4 bg-white rounded-2xl text-black text-sm"
      >
        {messages.map((message, index) => {
          const messageStyle =
            message.role === ROLE.User ? "bg-green-300" : "bg-blue-300";
          const containerStyle =
            message.role === ROLE.User ? "justify-end" : "justify-start";

          return (
            <div key={index} className={`flex-row flex mb-3 ${containerStyle}`}>
              <div
                style={{ maxWidth: "70%" }}
                className={`flex rounded-xl p-2 ${messageStyle} rounded-tl-none text-left`}
              >
                <p className="text-black">{message.content}</p>
              </div>
            </div>
          );
        })}
        <div>
          {loading ? (
            <img
              src={require("../assets/loading.gif")}
              className="rounded-full w-10 h-10"
              alt="loading"
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="flex items-center pt-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder=""
          className="border border-gray-300 p-2 rounded-md flex-grow text-black text-sm"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendMessage}
          className="ml-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Send
        </button>
      </div>

      <div className="flex items-center pt-2 justify-between">
        <div className="flex ml-0">
          <SpeedAdjuster
            speed={speed}
            onSpeedChange={handleSpeedChange}
            disabled={loading}
          />

          <button
            onClick={stopSpeaking}
            disabled={messages.length === 0}
            className="ml-5"
          >
            <span role="img" aria-label="Stop Sign">
              ⏸️
            </span>
          </button>
        </div>

        <button
          onClick={evaluateSession}
          className="ml-1 bg-green-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Evaluate
        </button>
      </div>

      <div className="flex-row items-center justify-between pb-5">
        <div className="items-center">
          {listening ? (
            <button onClick={stopRecording}>
              <img
                className="rounded-full w-10 h-10 mx-auto"
                src={require("../assets/voiceLoading.gif")}
                alt="voiceLoading"
              />
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={
                !browserSupportsSpeechRecognition && !isMicrophoneAvailable
              }
            >
              <img
                className="rounded-full w-10 h-10 mx-auto"
                src={require("../assets/recordingIcon.png")}
                alt="recordingIcon"
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex-row items-center justify-between pb-1">
        {!hasGermanVoice ? (
          <span className="text-sm">Browser doesn't have German voice.</span>
        ) : (
          <></>
        )}
        {!browserSupportsSpeechRecognition ? (
          <span className="text-sm">
            Browser doesn't support speech recognition.
          </span>
        ) : (
          <></>
        )}
        {!isMicrophoneAvailable ? (
          <span className="text-sm">Microphone is not available.</span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
