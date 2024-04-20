import React, { useState, useRef, useEffect } from "react";
import { chat } from "../api/fachai";
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
        setLoading(false);
        if (res) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: ROLE.Assistant, content: res },
          ]);
          setInputValue("");
          //startTextToSpeech(res.data[res.data.length - 1].content);
        } else {
          //Alert.alert('Error', res.data as unknown as string);
        }
      });
    }
  };

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
    </div>
  );
};

export default Chatbox;
