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
        uint8[7][6] board;
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
            require(msg.sender == theGame.player2, "Must be used on your turn.");
        } else {
            require(msg.sender == theGame.player1, "Must be used on your turn.");
        }
        _;
    }

    //even turns should be player 2
    modifier isNotTurn(uint256 key) {
        Game storage theGame = keyToGame[key];
        if (theGame.turn % 2 == 1) {
            require(msg.sender == theGame.player2, "Cannot be used on your turn.");
        } else {
            require(msg.sender == theGame.player1, "Cannot be used on your turn.");
        }
        _;
    }

    modifier isNotStart(uint256 key) {
        Game storage theGame = keyToGame[key];
        require(theGame.turn != 0, "Cannot be used on the first turn.");
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
        keyToGame[key] = Game(key, msg.sender, opponent, 0, msg.value, now, [[0,0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0,0],
                                                                    [0,0,0,0,0,0,0]]);
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
    
    modifier validMove(uint256 key, uint8 moveCol) {
        require(moveCol < 7, "There are only 7 columns. Columns 0-6");
        Game storage theGame = keyToGame[key];
        require(theGame.board[0][moveCol] == 0, "That column is full.");
        _;
    }

    function move(uint256 key, uint8 moveCol) external isTheirTurn(key) isNotStart(key) validMove(key, moveCol){
        if(play(key, moveCol)){
            Game storage theGame = keyToGame[key];
            delete playerToKey[theGame.player1];
            delete playerToKey[theGame.player2];
            msg.sender.transfer(theGame.pot);
            emit GameForfeited(theGame.key, theGame.player1, theGame.player2);
            delete keyToGame[key];
        }
    }

    function play(uint256 key, uint8 moveCol) internal returns (bool wonGame){
        keyToGame[key].turn++;
        
        // here use moveCol to play a token in a certain col, type based on whose turn it is
        // npx hardhat compile currently produces a warning since moveCol is currently unused
        Game storage theGame = keyToGame[key];
        uint8 value = 1;
        if (msg.sender == theGame.player2){
            value = 2;
        }
        
        uint8 moveRow = 0;
        if(theGame.board[5][moveCol]==0) 
        {
            theGame.board[5][moveCol]=value;
            moveRow = 5;
        }
        else if(theGame.board[4][moveCol]==0) 
        {
            theGame.board[4][moveCol]=value;
            moveRow = 4;
            
        }
        else if(theGame.board[3][moveCol]==0) 
        {
            theGame.board[3][moveCol]=value;
            moveRow = 3;
        }
        else if(theGame.board[2][moveCol]==0) {
            theGame.board[2][moveCol]=value;
            moveRow = 2;
        }
        else if(theGame.board[1][moveCol]==0) {
            theGame.board[1][moveCol]=value;
            moveRow = 1;
        }
        else 
        {
            theGame.board[0][moveCol]=value;
            moveRow = 0;
        }

        //calculate moveRow (first available row. Start with theGame.board[6][moveCol] as that is the bottom then [5] [4]...[0])
        
        //check vertical - col -1
        if (moveRow < 3) {
            if(theGame.board[moveRow+1][moveCol] == value && theGame.board[moveRow+2][moveCol] == value && theGame.board[moveRow+3][moveCol] == value) 
            {
                return true;
            }
        }
        //check horizontal - row + 1 and/or row -1
        uint8 counter = 0;
        for (uint8 i = 0;i < 7;i++) {
            
            if (theGame.board[moveRow][i] == value) {
                //check if the next 3 slots are the same
               counter++;
               if (counter == 4) {
                   return true;
               }
            }
            else 
                counter = 0;
        }
        
        
        //check right diagonal
        int signedCol = moveCol;
        if (signedCol-moveRow < 4 && signedCol-moveRow > -3){
            int8 count = 1;
            int8 row = int8(moveRow)-1;
            int8 col = int8(moveCol)-1;
            while(row > -1 && col > -1){
                if (theGame.board[uint(row)][uint(col)] == value){
                    count++;
                }else{
                    break;
                }
                row--;
                col--;
            }
            row = int8(moveRow) + 1;
            row = int8(moveCol) + 1;
            while(row < 6 && col < 7){
                if (theGame.board[uint(row)][uint(col)] == value){
                    count++;
                }else{
                    break;
                }
                row++;
                col++;
            }
            if(count>3)return true;
        }
        
        //check left diagonal
        if (moveCol+moveRow < 9 && moveCol+moveRow > 2){
            int8 count = 1;
            int8 row = int8(moveRow)+1;
            int8 col = int8(moveCol)-1;
            while(row < 6 && col > -1){
                if (theGame.board[uint(row)][uint(col)] == value){
                    count++;
                }else{
                    break;
                }
                row++;
                col--;
            }
            row = int8(moveRow) - 1;
            col = int8(moveCol) + 1;
            while(row > -1 && col < 7){
                if (theGame.board[uint(row)][uint(col)] == value){
                    count++;
                }else{
                    break;
                }
                row--;
                col++;
            }
            if(count>3)return true;
        }
        
        keyToGame[key].lastPlayedTimestamp = now;
        return false;
    }
    
    function getGameCount() external view returns (uint256 count) {
        return playerToKey[msg.sender].length;
    }

    function getGameState(uint256 gameId) public view returns (bytes memory state) {
        Game memory _game = keyToGame[gameId];
        state = abi.encodePacked(_game.board);
    }
}
