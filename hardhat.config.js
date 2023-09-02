require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = "39d0e7d3176bffef78e1363f875422daa57dafc2ec9376472f5a1a6499204572";

module.exports = {
  solidity: "0.8.17",
  paths:{
    artifacts:'./artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli:{
      url:"https://eth-goerli.g.alchemy.com/v2/7W22Ru8ta2mmVTcxs6Brr4_P9i68cziv",
      accounts:[`${PRIVATE_KEY}`],
    }
  },
};
