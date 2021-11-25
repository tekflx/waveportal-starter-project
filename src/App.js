import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {

  // State var to store user's public wallet address
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMess] = useState("");

  const contractAddress = "0x0c5eCFCe96CFc9b58e75f9874A01729fA7d81C1D";
  const contractABI = abi.abi;

  let textInput = React.createRef();  // React use ref to get input value

  let onOnclickHandler = (e) => {
    console.log(textInput.current.value); 
    setMess(textInput.current.value)
    wave()
    
  };

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

  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log('NewWave', from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);

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

         // Wave / write to contract
        const waveTxn = await wavePortalContract.wave(textInput.current.value, { gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);
        
        await waveTxn.wait();
        console.log("Mined ---", waveTxn.hash);

        getAllWaves();
             
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
        
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Mu5ztL3oP8U" title="Wave for that ETH" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        
        {/*
        * if there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>

        )}
        {currentAccount && (
          <div>
            <label>
              Message:
              <input type="text" ref={textInput} />
            </label>
            <button className="waveButton" onClick={onOnclickHandler}>
              Wave at Me
            </button>
          </div>
        )}

        <h2>Buildspace Legends</h2>
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