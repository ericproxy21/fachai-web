import React, { useState, useRef, useEffect } from "react";
import { chat } from "../api/fachai";
import { speakText } from "../tools/speechToText";
import { ROLE, Message } from "../Types/common";

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);

  const historyRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    fetchResponse();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const fetchResponse = () => {
    console.log("Fetch Response...");
    if (inputValue.trim().length > 0) {
      const msg = inputValue.trim();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: ROLE.User, content: msg },
      ]);
      setLoading(true);

      chat(msg).then((res: string) => {
        console.log("chatgpt API call result: ", res);

        if (res) {
          // To cancel the timer and reset it
          speakText(res);
          // window.speechSynthesis.cancel();
          // myTimeout = setTimeout(myTimer, 10000);

          // const toSpeak: string = res;
          // const utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(
          //   toSpeak
          // );

          // utt.onend = (): void => {
          //   clearTimeout(myTimeout);
          // };
          // utt.voice = germanVoice;
          // utt.rate = 1.2;

          // window.speechSynthesis.speak(utt);

          setMessages((prevMessages) => [
            ...prevMessages,
            { role: ROLE.Assistant, content: res },
          ]);
          setInputValue("");

          //startTextToSpeech(res.data[res.data.length - 1].content);
        } else {
          //Alert.alert('Error', res.data as unknown as string);
        }

        setLoading(false);
      });
    }
  };

  const startSpeaking = () => {};
  const stopSpeaking = () => {};
  const startRecording = () => {};
  const stopRecording = () => {};
  const clearMessageHistory = () => {};

  // Scroll to the bottom of the chat history when messages change
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={historyRef}
        className="overflow-y-auto h-full flex-grow border border-gray-300 p-4 bg-white rounded-3xl text-black text-sm"
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
      <div className="flex items-center pt-2">
        {recording ? (
          <button onClick={stopRecording}>
            <img
              className="rounded-full w-10 h-10"
              src={require("../assets/voiceLoading.gif")}
              alt="voiceLoading"
            />
          </button>
        ) : (
          <button onClick={startRecording}>
            <img
              className="rounded-full w-10 h-10"
              src={require("../assets/recordingIcon.png")}
              alt="recordingIcon"
            />
          </button>
        )}

        {messages.length > 0 && (
          <button
            onClick={clearMessageHistory}
            className="bg-neutral-400 rounded-3xl p-2 w-10 h-10"
          >
            <span className="text-white font-semibold text-sm">Clear</span>
          </button>
        )}
        {messages.length > 0 && (
          <button
            onClick={stopSpeaking}
            className="bg-red-400 rounded-3xl p-2  w-10 h-10"
          >
            <span className="text-white font-semibold text-sm">Stop</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
