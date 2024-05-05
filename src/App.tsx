import React, { useEffect } from "react";

import "./App.css";
import Chatbox from "./Components/Chatbox";
import { helloWorld } from "./api/fachai";
import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID ?? "G-6T9K6B19XE");

function App() {
  useEffect(() => {
    ReactGA.pageview("home");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await helloWorld();
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      {/* <div className="bg-blue-500 text-white p-4">
        This is a Tailwind CSS styled component.
      </div> */}
      <header className="App-header">
        {/* <div className="flex-row items-center justify-between pb-1">
          <img src={logo} alt="logo" className="App-logo mx-auto" />
        </div> */}
        <div className="w-full flex justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white font-bold">
              Fach.<span className="text-2xl font-bold text-gray-500">AI</span>
            </h1>
            <p className="text-sm italic text-white">
              Gespräch mit KI-Patienten für Arzt-Patienten-Gesprächsübungspraxis
              (Fachsprachenprüfung)
            </p>
          </div>
        </div>
        <div className="flex-grow pt-5 h-96 w-full inline-block px-8">
          <Chatbox></Chatbox>
        </div>
      </header>
    </div>
  );
}

export default App;
