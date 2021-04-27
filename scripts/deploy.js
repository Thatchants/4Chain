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
Deploying contracts with the account: 0x13ad4281ef916a79b31a4451C3b05136C5a2E9e6
Account balance: 1434727506999999950
4Chain contract address: 0xf2702354298bCC382300712Ffd535109e2B52FeF



 */