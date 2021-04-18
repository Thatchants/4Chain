async function main() {

    const [deployer] = await ethers.getSigners("localhost:8545");

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const FCF = await ethers.getContractFactory("FourChain");
    const FC = await FCF.deploy();

    console.log("4Chain contract address:", FC.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


// VVVVV These will change when 4chain is deployed VVVVVVV

/*

npx hardhat run --network rinkeby scripts/deploy.js
Deploying contracts with the account: 0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
Account balance: 440862942468775582807
CryptoZombies contract address: 0xB11f26ad0bb7f4705F9eB116c224FFc323798695

 */