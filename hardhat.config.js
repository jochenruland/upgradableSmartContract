require("@nomicfoundation/hardhat-toolbox");

// const HDWalletProvider = require('@truffle/hdwallet-provider');
//
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
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
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
