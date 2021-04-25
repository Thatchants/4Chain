import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Create an action button with link

class ActionButton extends Component {
  // format long names and addresses into xxxx...xxxx form

  truncate = (text, startChars, endChars) => {
    if (text.length > 12) {
      var start = text.substring(0, startChars);
      var end = text.substring(text.length - endChars, text.length);
      return start + "..." + end;
    }
    return text;
  };

  render() {
    const gameData = {
      gameNumber: this.props.data.gameNumber,
      player1: this.props.data.player1,
      player2: this.props.data.player2,
      turn: this.props.data.turn,
      pot: this.props.data.pot,
      lastPlay: this.props.data.lastPlay,
      boardState: this.props.data.boardState,
      isPlayer1: this.props.data.isPlayer1
    };

    const pathName = this.props.pathname;
    const buttonLabel = this.props.buttonLabel;

    //console.log("button label", this.props.buttonLabel, pathName, zombieData);
    return (
      <Link
        to={{
          pathname:  pathName ,
          state:  gameData
        }}
      >
        <Button primary disabled={this.props.disableMe}> {buttonLabel} </Button>
      </Link>
    );
  }
}

export default ActionButton;
