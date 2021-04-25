
export function parseBoard(s) {
  // cut off initial 0x
  s = s.substring(2, s.length)
  let board = []
  let BOARD_HEIGHT = 6;
  let BOARD_WIDTH = 7;
  let ITEM_BITS = 64;
  for (var i = 0; i < BOARD_HEIGHT; i++) {
      let row = []
      for (var j = 0; j < BOARD_WIDTH; j++) {
        let ind = i * j * ITEM_BITS + ITEM_BITS - 1; //find the char that represents a slot's value
        let val = parseInt(s.charAt(ind), 16);
        row.push(val);
      }
      board.push(row);
  }
  return board;
}