import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {
  // State var to store user's public wallet address
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xFCCe5eb139258002932c231EB69c5c4557909aB2";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we are authorized
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Connect Wallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Download MetaMask!!");
        return;
      } 

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
       
    } catch (error) {
      console.log(error)
    }
    
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="wave">👋</span> Hey there, gm!
        </div>

        <div className="bio">
        Hi, I'm Frank. I have worked on some of the biggest entertainment websites in the world, pretty cool right? Connect your Ethereum wallet and wave at me!
        <p>Just wanted to say thanks to Farza and all the buildspace team, you are doing amazing work!!</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {/*
        * if there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>

        )}
      </div>
   </div>
  );
}

export default App