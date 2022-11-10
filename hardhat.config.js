require("@nomicfoundation/hardhat-toolbox");

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
// const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
// const GOERLI_PRIVATE_KEY = "YOUR GOERLI PRIVATE KEY";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  networks: {
    mainnetFork: {
      url: "http://127.0.0.1:7545",
      // accounts: [GOERLI_PRIVATE_KEY],
      // host: "127.0.0.1",     // Localhost (default: none)
      // port: 7545,            // Standard Ethereum port (default: none)
      network_id: "999",       // Any network (default: none)
      websocket: true
    },
    //goerli: {
    //  url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //  accounts: [GOERLI_PRIVATE_KEY]
    //}
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  solidity: {
    version: "0.8.17"
  }
}
