const { expect } = require('chai');
const { waffle, ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const time = require("./helpers/time");

describe("FourChain", function () {

    const gameIds = [1, 2, 3];
    let FC;
    let FCInstance;
    let alice, bob, steve;


    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.

    beforeEach(async function () {
        [alice, bob, steve] = await ethers.getSigners();
        FC = await ethers.getContractFactory("FourChain");
        FCInstance = await FC.deploy();
    });


    describe("Game invite creation", function () {
        it("Should be able to create an invite", async () => {
            await expect(FCInstance.createGame(bob.address))
                .to.emit(FCInstance, 'NewInvite')
                .withArgs(1, alice.address, bob.address);
            const x = await FCInstance.getGameCount();
            expect(x).to.equal(1);
        });
        it("Invites with eth should add to the pot", async () => {
            await FCInstance.createGame(bob.address, {value: 200});
            const bal = await provider.getBalance(FCInstance.address);
            expect(bal).to.equal(200);
        });
        it("should create a second game", async () => {
            await expect(FCInstance.createGame(bob.address))
                .to.emit(FCInstance, 'NewInvite')
                .withArgs(1, alice.address, bob.address);
            await expect(FCInstance.createGame(steve.address))
                .to.emit(FCInstance, 'NewInvite')
                .withArgs(2, alice.address, steve.address);
        });
        it("Should not be able to play against self", async () => {
            await expect(FCInstance.createGame(alice.address)).to.be.reverted;
        });
    });

    describe("Forfeit claiming", function () {
        it("Should be able to reclaim unaccepted challenge pot", async () => {
            await FCInstance.createGame(bob.address);
            time.increase(time.duration.weeks(1));
            await expect(FCInstance.claimForfeit(gameIds[0]))
                  .to.emit(FCInstance, 'GameForfeited')
                  .withArgs(gameIds[0], alice.address, bob.address);
        });
        it("Should not be able to claim game without time passage", async () => {
            await FCInstance.createGame(bob.address);
            await expect(FCInstance.claimForfeit(gameIds[0]))
                  .to.be.reverted;
        });
        it("Forfeits should give the claimer back their funds", async () => {
            await FCInstance.createGame(bob.address, {value: 500});
            time.increase(time.duration.weeks(1));
            await expect(await FCInstance.claimForfeit(gameIds[0]))
                  .to.changeEtherBalance(alice, 500);
        });
        it("Should be able to claim forfeits after game has begun with full pot", async () => {
            await FCInstance.createGame(bob.address, {value: 500});
            await FCInstance.connect(bob).accept(gameIds[0], 1, {value: 500});
            time.increase(time.duration.weeks(1));
            await expect(await FCInstance.connect(bob).claimForfeit(gameIds[0]))
                  .to.changeEtherBalance(bob, 1000);
        });
    });

    describe("Turn changing", function () {
        it("First player should not be able to play immediately", async () => {
            await FCInstance.createGame(bob.address);
            await expect(FCInstance.accept(gameIds[0], 0)).to.be.reverted;
        });
        it("Second player should be able to play immediately", async () => {
            await FCInstance.createGame(bob.address, {value: 50});
            await FCInstance.connect(bob).accept(gameIds[0], 1, {value: 50});
            expect(await provider.getBalance(FCInstance.address)).to.equal(100);
        });
        it("First player should be able to play after game accepted", async () => {
            await FCInstance.createGame(bob.address, {value: 50});
            await FCInstance.connect(bob).accept(gameIds[0], 1, {value: 50});
            await FCInstance.move(gameIds[0], 1);
            let g = await FCInstance.keyToGame(gameIds[0]);
            await expect(g.turn).to.equal(2);
        });
        it("Second player with less than pot should not be able to accept", async () => {
            await FCInstance.createGame(bob.address, {value: 200});
            await expect(FCInstance.connect(bob).accept(gameIds[0], 1, {value: 50})).to.be.reverted;
            expect(await provider.getBalance(FCInstance.address)).to.equal(200);
        });
    });

    describe("Accessing game data", function () {
        it("Should be able to get gameId from mapping", async () => {
            await FCInstance.createGame(bob.address);
            await expect(await FCInstance.playerToKey(alice.address, 0)).to.equal(gameIds[0]);
            await expect(await FCInstance.playerToKey(bob.address, 0)).to.equal(gameIds[0]);
        });
        it("Should be able to get turn", async () => {
            await FCInstance.createGame(bob.address);
            let g = await FCInstance.keyToGame(gameIds[0]);
            await expect(g.turn).to.equal(0);
            // play the next turn
            await FCInstance.connect(bob).accept(gameIds[0], 1, {value: 50});
            g = await FCInstance.keyToGame(gameIds[0]);
            await expect(g.turn).to.equal(1);
        });
        it("Should be able to get board bits", async () => {
            await FCInstance.createGame(bob.address);
            let gs = await FCInstance.getGameState(gameIds[0]);
            let hex_chars = 2;
            let int_size = 64;
            let board_slots = 42;
            expect(gs.length).to.equal(int_size * board_slots + hex_chars);
        });
    });

})
