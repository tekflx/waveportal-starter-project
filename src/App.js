import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {

  // State var to store user's public wallet address
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState("");
  const [mining, setMining] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0x4105795adf114CBD8bd6da0bF7eF90200Fe6e85B";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);  

      } else {
        console.log("Eth object not found");
      }

    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } 

      // Check if we are authorized
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
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
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // read contract
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());

        // Wave / write to contract
        const waveTxn = await wavePortalContract.wave("tmp fix message");
        console.log("Mining...", waveTxn.hash);
        setMining(1)

        await waveTxn.wait();
        console.log("Mined ---", waveTxn.hash);
        setMining("");

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber())
      } else {
        console.log("Ethereum object not found");
      }
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

        {mining && (
          <h2>Mining in Progress ...</h2>
        )}
        {/*
        * if there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>

        )}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "Oldlace", marginTop: "16px", padding: "8px"}}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })}
      </div>
   </div>
  );
}

export default App