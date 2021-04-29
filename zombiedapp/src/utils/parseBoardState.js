export function parseBoard(s) {
    s = s.substring(2, s.length)
    
    let board = [];
    for(var i = 0;i < s.length-63;i+=64){
        board.push(parseInt(s.charAt(i+63, 16)));
    }
    
    let board2D = [];
    for(var i = 0;i < board.length;i+=7){
        board2D.push([board[i],board[i+1],board[i+2],board[i+3],board[i+4],board[i+5],board[i+6]]);
    }
    return board2D;
}
