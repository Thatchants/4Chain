pragma solidity >=0.5.0 <0.6.0;

import "./ownable.sol";
import "./safemath.sol";

contract GameFactory is Ownable {
    struct Game {
        uint256 key;
        address player1;
        address player2;
        uint8 turn;
        uint256 pot;
        uint256 lastPlayedTimestamp;
        uint8[6][7] board;
    }

    uint256 gamesMade = 0;
    uint expirationTime = 1 weeks;

    mapping (address => uint256[]) public playerToKey;
    mapping (uint256 => Game) public keyToGame;

    event NewInvite(uint256 id, address player1, address player2);
    event GameForfeited(uint256 id, address player1, address player2);
    
    //even turns should be player 2
    modifier isTheirTurn(uint256 key) {
        Game storage theGame = keyToGame[key];
        if (theGame.turn % 2 == 0) {
            require(msg.sender == theGame.player2);
        } else {
            require(msg.sender == theGame.player1);
        }
        _;
    }

    //even turns should be player 2
    modifier isNotTurn(uint256 key) {
        Game storage theGame = keyToGame[key];
        if (theGame.turn % 2 == 1) {
            require(msg.sender == theGame.player2, "Player 1's turn.");
        } else {
            require(msg.sender == theGame.player1, "Player 2's turn.");
        }
        _;
    }

    modifier isNotStart(uint256 key) {
        Game storage theGame = keyToGame[key];
        require(theGame.turn == 0);
        _;
    }
    
    modifier notAgainstSelf(address opponent) {
        require(msg.sender != opponent, "You cannot play against yourself.");
        _;
    }

    modifier expired(uint256 key) {
        Game storage theGame = keyToGame[key];
        uint256 timePassed = now - theGame.lastPlayedTimestamp;
        require(timePassed >= expirationTime, "Game not yet able to be claimed.");
        _;
    }

    function setExpirationTime(uint _seconds) public onlyOwner {
        expirationTime = _seconds;
    }

    function createGame(address opponent) external payable notAgainstSelf(opponent){
        uint256 key = SafeMath.add(gamesMade, 1);
        gamesMade = key;
        playerToKey[msg.sender].push(key);
        playerToKey[opponent].push(key);
        keyToGame[key] = Game(key, msg.sender, opponent, 0, msg.value, now, [[0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0]]);
        emit NewInvite(key, msg.sender, opponent);
    }

    // used when accepting a proposed match
    // different from usual play since it requires payment
    function accept(uint256 key, uint8 moveCol) external payable isTheirTurn(key) {
        Game storage theGame = keyToGame[key];

        // The opponent should offer at least the amount already in the pot
        require(msg.value >= theGame.pot);
        theGame.pot = SafeMath.add(theGame.pot, msg.value);
        // move
        play(key, moveCol);
    }

    // forfeits can be claimed when plays are not made by an opponent for over an expirationTime period
    // (default 1 week)
    function claimForfeit(uint256 key) external expired(key) isNotTurn(key) {
        Game storage theGame = keyToGame[key];
        delete playerToKey[theGame.player1];
        delete playerToKey[theGame.player2];
        msg.sender.transfer(theGame.pot);
        emit GameForfeited(theGame.key, theGame.player1, theGame.player2);
        delete keyToGame[key];
    }

    function play(uint256 key, uint8 moveCol) public isTheirTurn(key) isNotStart(key) {
        keyToGame[key].turn++;
        

        // here use moveCol to play a token in a certain col, type based on whose turn it is
        // npx hardhat compile currently produces a warning since moveCol is currently unused


        keyToGame[key].lastPlayedTimestamp = now;
    }

    function getGameCount() external view returns (uint256 count) {
        return playerToKey[msg.sender].length;
    }
}
