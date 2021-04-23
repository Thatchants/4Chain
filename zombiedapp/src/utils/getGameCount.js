import store from "../redux/store";

export const GAME_COUNT = "GAME_COUNT"; // action type

// action creator (dispatch sends this to redux reducer)
function gameCount(data) {
  return {
    type: GAME_COUNT,
    payload: data
  };
}

//
//  set up the blockchain shadow contract, user address, and user game count.  Put into redux store.
//

async function getGameCount(CZ) {
  // get number of games in progress with the user account
  let userGameCount = +(await CZ.getGameCount());  // + convert a string to an integer

  // put state data into the REDUX store for easy access from other pages and components

  let data = {
    userGameCount          //EC7 shorthand for userGameCount:userGameCount because of same variable name
  };

  store.dispatch(gameCount(data));
}

export default getGameCount;