import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="wave">👋</span> Hey there, gm!
        </div>

        <div className="bio">
        I am Frank and I worked on some of the biggest entertainment websites in the world, pretty cool right? Connect your Ethereum wallet and wave at me!
        <p>Just wanted to say thanks to Farza and all buildspace team, you are doing amazing work!!</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
