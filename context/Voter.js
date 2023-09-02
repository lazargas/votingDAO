import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
import { Buffer } from 'buffer';
//INTERNAL IMPORT
import Create from "../artifacts/contracts/Create.sol/Create.json";
const CreatorAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const projectId = "2IuYl6JV9M1CGJYU9UYxrrXtsrh";
const projectSecret = "243164c76b145cae1884669b71940b37";
const auth =
'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});


const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CreatorAddress, Create.abi, signerOrProvider);

  const initializeContract = async () => {
    try {
      if(typeof window.ethereum!=="undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      contract = fetchContract(provider);
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }
  };


export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  // =========================================================
  //---ERROR Message
  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [savedAddress,setSavedAddress] = useState("");
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);
  const [winner,setWinner] = useState("");
  ///CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      getAllVoterData();
      getNewCandidate();
    } else {
      setError("Please Install MetaMask & Connect, Reload");
    }
  };

  // ===========================================================
  //CONNECT Wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    getAllVoterData();
    getNewCandidate();
  };
  // ================================================
  
  //UPLOAD TO IPFS Voter
  const uploadToIPFS = async (file) => {
    //setUploading(true);
    try {
      
      const added = await client.add({ content: file });

      const url = `https://akarsh.infura-ipfs.io/ipfs/${added.path}`;

      //setImage(url);
      return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };

  //UPLOAD TO IPFS Candidate
  const uploadToIPFSCandidate = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `https://akarsh.infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };
  // =============================================
  //CREATE VOTER----------------------
  const createVoter = async (formInput, fileUrl) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position)
      return console.log("Input Data is missing");

    let candu;
    try {
      if(typeof window.ethereum!=="undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    candu = fetchContract(provider.getSigner());
    const data = JSON.stringify({ name, address, position, image: fileUrl });
    const added = await client.add(data);

    const url = `https://akarsh.infura-ipfs.io/ipfs/${added.path}`;

    const voter = await candu.voterRight(address, name, url, fileUrl);
    voter.wait();
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }

    

    router.push("/voterList");
  };
  // =============================================

  const getAllVoterData = async () => {
    let contract;
    try {
    if(typeof window.ethereum!=="undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = fetchContract(provider);
    const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        pushVoter.push(singleVoterData);
      });

      //VOTER LENGHT
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());
      console.log(voterLength);
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }
  };

  // =============================================

  // =============================================
  ////////GIVE VOTE

  const giveVote = async (candidateAddress,candidateId) => {
    let candu;
    try {
      if(typeof window.ethereum!=="undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    candu = fetchContract(provider.getSigner());
    console.log(candidateAddress);
    console.log(candidateId);
    const voteredList = await candu.vote(candidateAddress, candidateId);
    voteredList.wait();
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    


    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return console.log("Input Data is missing");

    let candu;
    try {
      if(typeof window.ethereum!=="undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      candu = fetchContract(provider.getSigner());
      const data = JSON.stringify({
        name,
        address,
        image: fileUrl,
        age,
      });
      const added = await client.add(data);
  
      const ipfs = `https://akarsh.infura-ipfs.io/ipfs/${added.path}`;
  
      const candidate = await candu.setCandidate(
        address,
        age,
        name,
        fileUrl,
        ipfs
      );
      candidate.wait();
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }

    

    router.push("/");
  };

  const getNewCandidate = async () => {
    let candu;
    try {
      if(typeof window.ethereum!=="undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    candu = fetchContract(provider);
    const allCandidate = await candu.getCandidate();
    allCandidate.map(async (el) => {
      const singleCandidateData = await candu.getCandidateData(el);
      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());
    });
    const allCandidateLength = await candu.getCandidateLength();
    setCandidateLength(allCandidateLength.toNumber());
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }
  };

  const getWinner = async () =>{
    let candu;
    try {
      if(typeof window.ethereum!=="undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    candu = fetchContract(provider);
    const theWinner = await candu.getWinner();
    const winnerData = await candu.getCandidateData(theWinner);
    const winnerName = winnerData[1];
    console.log(winnerName);
    setWinner(winnerName);
      }
    } catch (error) {
      console.log("Error initializing contract:", error);
    }
  };

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createVoter,
        setCandidate,
        getNewCandidate,
        savedAddress,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
        getWinner,
        winner
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
