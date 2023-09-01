import { useEffect } from "react";
import { ethers } from "ethers";

const MetaMaskConnector = ({ setConnectedAddress }) => {
  useEffect(() => {
    const initialize = async () => {
      // Checking if MetaMask is installed
      if (typeof window.ethereum!=="undefined") {
        try {
          // Checking if there's an address already connected
          let address;
          const savedAddress = localStorage.getItem("connectedAddress");
          if (savedAddress) {
            // Use the saved address
            address = savedAddress;
          } else {
            // Request account access
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            address = accounts[0];
            localStorage.setItem("connectedAddress", address);
          }

          setConnectedAddress(address);

          // Listen for account changes and update the UI
          window.ethereum.on("accountsChanged", (accounts) => {
            setConnectedAddress(accounts[0]);
            localStorage.setItem("connectedAddress", accounts[0]);
          });
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.log("MetaMask is not installed.");
      }
    };

    initialize();
  }, [setConnectedAddress]);

  return null;
};

export default MetaMaskConnector;
