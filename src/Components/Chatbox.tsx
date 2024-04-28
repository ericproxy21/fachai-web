import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  chat,
  rateLanguage,
  ratePerformance,
  setupSession,
} from "../api/fachai";
import { ROLE, Message } from "../Types/common";
import SpeedAdjuster from "./SpeedAdjuster";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useTextToSpeech from "../hooks/useTextToSpeech";
import HelpScreen from "./HelpScreen";

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionEnded, setSessionEnded] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [speed, setSpeed] = useState(1.2);
  const [disease, setDisease] = useState<string>("");
  const [isHideAiText, setIsHideAiText] = useState<boolean>(false);
  const [historyKey, setHistoryKey] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("german");
  const [recordingDebouncing, setRecordingDebouncing] = useState(false);
  const [showHelpScreen, setShowHelpScreen] = useState(false);
  const { speakText, hasLangVoice, stopText, isSpeakingText } =
    useTextToSpeech(selectedLanguage);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    stopSpeaking();
    fetchResponse(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleHelpScreen = () => {
    setShowHelpScreen(!showHelpScreen);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    resetSession();
  };

  const fetchResponse = useCallback(
    (msg: string) => {
      msg = msg.trim();
      if (msg.length > 0 && historyKey.length > 0) {
        setLoading(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: ROLE.User, content: msg },
        ]);

        chat(msg, historyKey, selectedLanguage).then((res: string) => {
          if (res) {
            // To cancel the timer and reset it
            setSpeaking(true);
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
    [
      setMessages,
      setLoading,
      speed,
      setInputValue,
      speakText,
      historyKey,
      selectedLanguage,
    ]
  );

  const stopSpeaking = () => {
    stopText();
  };

  const startRecording = () => {
    if (!recordingDebouncing) {
      setRecordingDebouncing(true);
      resetTranscript();
      SpeechRecognition.stopListening();
      SpeechRecognition.startListening({
        continuous: true,
        language: getListeningLanguage(),
      }); //{ language: 'zh-CN' }
      setTimeout(() => {
        setRecordingDebouncing(false);
      }, 1000);
    }
  };

  const getListeningLanguage = (): string => {
    switch (selectedLanguage.toLowerCase()) {
      case "english":
        return "en-US";
      case "spanish":
        return "es-ES";
      case "german":
        return "de-DE";
      case "italian":
        return "it-IT";
      case "french":
        return "fr-FR";
      default:
        return "de-DE";
    }
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    fetchResponse(transcript);
    resetTranscript();
  };
  const clearMessageHistory = () => {
    setMessages([]);
  };

  const resetSession = () => {
    clearMessageHistory();
    setSessionEnded(false);
    setup();
  };

  const evaluateSession = () => {
    setLoading(true);
    setSessionEnded(true);
    // Perform both actions concurrently using Promise.all
    Promise.all([
      ratePerformance(historyKey, selectedLanguage),
      rateLanguage(historyKey, selectedLanguage),
    ])
      .then(([performanceRes, languageRes]) => {
        // Update state after both actions are completed
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: ROLE.Assistant,
            content: `Die Krankheit des Patienten ist ${disease}.`,
          },
          { role: ROLE.Assistant, content: performanceRes },
          { role: ROLE.Assistant, content: languageRes },
        ]);
        speakText(
          `Die Krankheit des Patienten ist ${disease}. ${performanceRes} ${languageRes}`,
          speed
        );
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error:", error);
      })
      .finally(() => {
        // Set loading to false after both actions are completed
        setLoading(false);
      });
  };

  const setup = async () => {
    try {
      const response = await setupSession();
      const { disease, historyKey } = await response;
      setDisease(disease);
      setHistoryKey(historyKey);
      //console.log(`Disease is ${disease} and History Key is ${historyKey}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Effect for making the API call when component mount
    setup(); // Call the fetchData function
  }, []); // Empty dependency array ensures the effect runs only once

  // Scroll to the bottom of the chat history when messages change

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
    // if (!listening && transcript !== "") {
    //   fetchResponse(transcript);
    //   resetTranscript();
    // }
    setSpeaking(isSpeakingText);
  }, [
    messages,
    listening,
    transcript,
    fetchResponse,
    resetTranscript,
    isSpeakingText,
  ]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const hideAiText = () => {
    setIsHideAiText(!isHideAiText);
  };

  return (
    <div className="flex flex-col h-full">
      {showHelpScreen && <HelpScreen onClose={toggleHelpScreen} />}
      <div className="flex justify-end">
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="text-black text-sm ml-auto p-1 mb-1"
        >
          <option value="german">DE</option>
          <option value="english">EN</option>
          <option value="spanish">ES</option>
          <option value="french">FR</option>
          <option value="italian">IT</option>
        </select>
        <button onClick={toggleHelpScreen} className="ml-5 mr-2">
          <span role="img" aria-label="Reset Sign">
            ?
          </span>
        </button>
      </div>
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
                <p
                  className={`text-black ${
                    isHideAiText && message.role === ROLE.Assistant
                      ? "hidden"
                      : ""
                  }`}
                >
                  {message.content}
                </p>{" "}
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
          disabled={loading || sessionEnded}
        />
        <button
          onClick={loading || sessionEnded ? undefined : handleSendMessage}
          className={`ml-1 px-4 py-2 rounded-md text-sm ${
            loading || sessionEnded
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          disabled={loading || sessionEnded}
        >
          Send
        </button>
      </div>

      <div className="flex items-center pt-2 justify-between">
        <div className="flex ml-0">
          <div>
            <SpeedAdjuster
              speed={speed}
              onSpeedChange={handleSpeedChange}
              disabled={loading || speaking}
            />
          </div>

          <button
            onClick={stopSpeaking}
            disabled={messages.length === 0}
            className="ml-3"
            title="Stop AI speaking"
          >
            <span role="img" aria-label="Stop Sign">
              ⏸️
            </span>
          </button>

          <button
            onClick={hideAiText}
            disabled={loading}
            className="ml-3"
            title="Hide AI text"
          >
            <span role="img" aria-label="Reset Sign">
              👁️
            </span>
          </button>

          <button
            onClick={resetSession}
            disabled={loading}
            className="ml-3"
            title="Reset session"
          >
            <span role="img" aria-label="Reset Sign">
              🔄
            </span>
          </button>
        </div>

        {loading || speaking || sessionEnded || messages.length === 0 ? (
          <button
            className="ml-1 bg-gray-400 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed"
            disabled
          >
            Evaluate
          </button>
        ) : (
          <button
            onClick={evaluateSession}
            className="ml-1 bg-green-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Evaluate
          </button>
        )}
      </div>

      <div className="flex-row items-center justify-between">
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
                !browserSupportsSpeechRecognition ||
                !isMicrophoneAvailable ||
                loading ||
                speaking ||
                recordingDebouncing
              }
            >
              <img
                className={`rounded-full w-10 h-10 mx-auto ${
                  !browserSupportsSpeechRecognition ||
                  !isMicrophoneAvailable ||
                  loading ||
                  speaking ||
                  recordingDebouncing
                    ? "grayscale"
                    : ""
                }`}
                src={require("../assets/recordingIcon.png")}
                alt="recordingIcon"
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex-row items-center justify-between pb-1">
        {hasLangVoice !== null && hasLangVoice === false ? (
          <span className="text-sm">
            Browser doesn't have {selectedLanguage} voice.
          </span>
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
