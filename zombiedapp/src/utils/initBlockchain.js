import FourChain from "../contract_ABI/FourChain.sol/FourChain.json";
import store from "../redux/store";
import { ethers } from "ethers";

export const BLOCKCHAIN_INITIALIZED = "BLOCKCHAIN_INITIALIZED"; // action type

// action creators (dispatch sends this to redux reducer)

function blockchainInitialized(data) {
    return {
        type: BLOCKCHAIN_INITIALIZED,
        payload: data
    };
}


//  set up provider, signer and contract instance

const initBlockchain = async () => {

    // get contract instance and user address
    // If you don't specify a //url//, Ethers connects to the default
    // (i.e. ``http:/\/localhost:8545``)

    // I used this to connect to Ganache:

    //const provider = await new ethers.providers.JsonRpcProvider();
    //console.log("provider", provider);

    let provider;
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));

    // The provider also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, we need the account signer...

    const signer = await provider.getSigner()
    console.log("signer", signer);
    const userAddress =  await signer.getAddress();
    console.log("user address", userAddress);

    // initialize shadow contract

    let CZ = null;
    console.log("READ ABI");
    //const abi = JSON.parse(CryptoZombiesContract.abi);
    const abi = JSON.parse(`[
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "playerToKey",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "uint256"
          },
          {
            "name": "moveCol",
            "type": "uint8"
          }
        ],
        "name": "move",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "opponent",
            "type": "address"
          }
        ],
        "name": "createGame",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "uint256"
          },
          {
            "name": "moveCol",
            "type": "uint8"
          }
        ],
        "name": "accept",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_seconds",
            "type": "uint256"
          }
        ],
        "name": "setExpirationTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "uint256"
          }
        ],
        "name": "claimForfeit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "keyToGame",
        "outputs": [
          {
            "name": "key",
            "type": "uint256"
          },
          {
            "name": "player1",
            "type": "address"
          },
          {
            "name": "player2",
            "type": "address"
          },
          {
            "name": "turn",
            "type": "uint8"
          },
          {
            "name": "pot",
            "type": "uint256"
          },
          {
            "name": "lastPlayedTimestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getGameCount",
        "outputs": [
          {
            "name": "count",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "gameId",
            "type": "uint256"
          }
        ],
        "name": "getGameState",
        "outputs": [
          {
            "name": "state",
            "type": "bytes"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "player1",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "player2",
            "type": "address"
          }
        ],
        "name": "NewInvite",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "player1",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "player2",
            "type": "address"
          }
        ],
        "name": "GameForfeited",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ]`);

   // CZ = new ethers.Contract('0xf01b5d859b2a73DBE407f4553b06ffF50F19b7e4', abi, signer);
    CZ = new ethers.Contract('0x5F4188810b690D180468a9a2c1370e7b422632c7', abi, signer);
    // put state data into the REDUX store for easy access from other pages and components

    let data = { provider, signer, CZ, userAddress };
    store.dispatch(blockchainInitialized(data));
  return data;
}

export default initBlockchain;
