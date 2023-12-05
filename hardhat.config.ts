require("@nomiclabs/hardhat-waffle");
import "@nomiclabs/hardhat-etherscan";
module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {},
    development: {
      url: "http://127.0.0.1:7545",
      port: 7545,
      network_id: "*"
    },
    fantom: {
      chainId: 250,
      url: "https://rpcapi.fantom.network",
      accounts: {
        
        mnemonic:"",
      },
    },
    fantomtestnet: {
      chainId: 4002,
      url: "https://rpc.testnet.fantom.network",
      accounts: {
        
        mnemonic:"",
      },      
    },
    ropsten:{
      network_id: 3,
      url: "https://ropsten.infura.io/v3/98ebfa84764d488183cc6dddcc2bfc4c",
      accounts: {
        mnemonic: "",
      },
    }
  },
  etherscan: {
    apiKey: "API_KEY",
  }
};
