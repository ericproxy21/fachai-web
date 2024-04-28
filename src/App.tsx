import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Chatbox from "./Components/Chatbox";
import { helloWorld } from "./api/fachai";

function App() {
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
        <div className="flex-row items-center justify-between pb-1">
          <img src={logo} alt="logo" className="App-logo mx-auto" />
        </div>
        <div className="w-full">
          <h1 className="text-2xl text-white ">
            Arzt-Patienten-Gesprächsübung
          </h1>
          <p className="text-sm italic">für fachsprachenprüfung</p>
        </div>
        <div className="flex-grow pt-8 h-96 w-full inline-block px-8">
          <Chatbox></Chatbox>
        </div>
      </header>
    </div>
  );
}

export default App;
