import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chatbox from "./Components/Chatbox";

function App() {
  return (
    <div className="App">
      {/* <div className="bg-blue-500 text-white p-4">
        This is a Tailwind CSS styled component.
      </div> */}
      <header className="App-header">
        <div className="h-24">
          <img src={logo} alt="logo" className="App-logo" />
        </div>
        <div className="w-full">
          <h1 className="text-2xl text-white ">
            Doctor-Patient Conversation Practice
          </h1>
        </div>
        <div className="flex-grow pt-8 h-96 w-full inline-block px-8">
          <Chatbox></Chatbox>
        </div>
      </header>
    </div>
  );
}

export default App;
