require("@nomicfoundation/hardhat-toolbox");
// require("hardhat-contract-sizer");
require("hardhat-preprocessor");

const fs = require("fs");
require("dotenv").config();

const { setGlobalDispatcher, ProxyAgent } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);



const mainnetAccount = process.env.mainnetAccount

const ethscanKey = process.env.ethscanKey
const maticscanKey = process.env.maticscanKey





function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line) => line.trim().split("="));
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          viaIR: false,
          optimizer: {
            enabled: true,
            runs: 200,
            details: { yul: false },
          },
        },
      },
    ],
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  preprocess: {
    eachLine: (hre) => ({
      transform: (line) => {
        if (line.match(/^\s*import /i)) {
          for (const [from, to] of getRemappings()) {
            if (line.includes(from)) {
              line = line.replace(from, to);
              break;
            }
          }
        }
        return line;
      },
    }),
  },

  networks: {
    hardhat: {
      //  forking: {
      //    url: 'https://1rpc.io/matic'
      //  },
      // blockGasLimit: 30_000_000,
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [
        mainnetAccount
      ],
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [
        mainnetAccount
      ],
    },
    matic: {
      url: 'https://1rpc.io/matic',
      accounts: [
        mainnetAccount
      ]
    }
  },

  // paths: {
  //   sources: "./src",
  //   cache: "./cache_hardhat",
  // },

  etherscan: { apiKey: maticscanKey },
};
