import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import { truncate } from "../utils/truncate";

class GameCardContent extends Component {

  render() {
    return (
      <Card.Content>
        <Card.Header>
          {truncate(this.props.game.player1, 6, 4)} <b>VS</b> {truncate(this.props.game.player2, 6, 4)}
        </Card.Header>
        <Card.Description>
          Game no.: {this.props.game.gameNumber} <br />
          Turn: {this.props.game.turn} <br />
          Pot: {this.props.game.pot} <br />
          Last played: {this.props.game.lastPlay} <br />
        </Card.Description>
      </Card.Content>
    );
  }
}
export default GameCardContent;
