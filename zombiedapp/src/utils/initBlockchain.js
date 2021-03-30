import CryptoZombiesContract from "../contract_ABI/CryptoZombies.sol/CryptoZombies.json";
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
    const abi = JSON.parse("[\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_approved\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_tokenId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"approve\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": true,\n" +
        "      \"stateMutability\": \"payable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"levelUp\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": true,\n" +
        "      \"stateMutability\": \"payable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_kittyId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"feedOnKitty\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"zombies\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"name\",\n" +
        "          \"type\": \"string\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"dna\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"level\",\n" +
        "          \"type\": \"uint32\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"readyTime\",\n" +
        "          \"type\": \"uint32\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"winCount\",\n" +
        "          \"type\": \"uint16\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"lossCount\",\n" +
        "          \"type\": \"uint16\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_from\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_to\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_tokenId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"transferFrom\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": true,\n" +
        "      \"stateMutability\": \"payable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [],\n" +
        "      \"name\": \"withdraw\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_owner\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"getZombiesByOwner\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"uint256[]\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"zombieToOwner\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_address\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"setKittyContractAddress\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_newDna\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"changeDna\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_tokenId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"ownerOf\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_seconds\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"setCooldownTime\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_owner\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"balanceOf\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [],\n" +
        "      \"name\": \"renounceOwnership\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_name\",\n" +
        "          \"type\": \"string\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"createRandomZombie\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [],\n" +
        "      \"name\": \"owner\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": true,\n" +
        "      \"inputs\": [],\n" +
        "      \"name\": \"isOwner\",\n" +
        "      \"outputs\": [\n" +
        "        {\n" +
        "          \"name\": \"\",\n" +
        "          \"type\": \"bool\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"view\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_newName\",\n" +
        "          \"type\": \"string\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"changeName\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_fee\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"setLevelUpFee\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"_zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"name\": \"_targetId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"attack\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"constant\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"name\": \"newOwner\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"transferOwnership\",\n" +
        "      \"outputs\": [],\n" +
        "      \"payable\": false,\n" +
        "      \"stateMutability\": \"nonpayable\",\n" +
        "      \"type\": \"function\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"anonymous\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_from\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_to\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_tokenId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"Transfer\",\n" +
        "      \"type\": \"event\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"anonymous\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_owner\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_approved\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"_tokenId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"Approval\",\n" +
        "      \"type\": \"event\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"anonymous\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"indexed\": false,\n" +
        "          \"name\": \"zombieId\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": false,\n" +
        "          \"name\": \"name\",\n" +
        "          \"type\": \"string\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": false,\n" +
        "          \"name\": \"dna\",\n" +
        "          \"type\": \"uint256\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"NewZombie\",\n" +
        "      \"type\": \"event\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"anonymous\": false,\n" +
        "      \"inputs\": [\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"previousOwner\",\n" +
        "          \"type\": \"address\"\n" +
        "        },\n" +
        "        {\n" +
        "          \"indexed\": true,\n" +
        "          \"name\": \"newOwner\",\n" +
        "          \"type\": \"address\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"name\": \"OwnershipTransferred\",\n" +
        "      \"type\": \"event\"\n" +
        "    }\n" +
        "  ]");

   // CZ = new ethers.Contract('0xf01b5d859b2a73DBE407f4553b06ffF50F19b7e4', abi, signer);
    CZ = new ethers.Contract('0xB11f26ad0bb7f4705F9eB116c224FFc323798695', abi, signer);
    // put state data into the REDUX store for easy access from other pages and components

    let data = { provider, signer, CZ, userAddress };
    store.dispatch(blockchainInitialized(data));
  return data;
}

export default initBlockchain;
