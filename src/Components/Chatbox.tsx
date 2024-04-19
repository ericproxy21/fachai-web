import React, { useState, useRef, useEffect } from "react";

interface Message {
  text: string;
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const historyRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue }]);
      setInputValue("");
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
        className="overflow-y-auto h-full flex-grow border border-gray-300 p-4 bg-white rounded-3xl text-black "
      >
        {messages.map((message, index) => (
          <div key={index} className="my-2">
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center pt-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder=""
          className="border border-gray-300 p-2 rounded-md flex-grow text-black text-sm"
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
