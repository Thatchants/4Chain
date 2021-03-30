import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import ZombieChar from "./zombieChar";

class ZombieCardContent extends Component {
  truncate = (text, startChars, endChars) => {
    if (text.length > 12) {
      var start = text.substring(0, startChars);
      var end = text.substring(text.length - endChars, text.length);
      return start + "..." + end;
    }
    return text;
  };

  render() {
    return (
      <Card.Content>
        <div>
          {" "}
          <ZombieChar DNA={this.props.zombie.zombieDNA} />{" "}
        </div>
        <Card.Header>
          Zombie ID: <b>{this.props.zombie.zombieId}</b> <br /> Name :{" "}
          <b>{this.truncate(this.props.zombie.zombieName, 8, 8)}</b>
        </Card.Header>
        <Card.Description>
          DNA: {this.props.zombie.zombieDNA} <br />
          Level: {this.props.zombie.zombieLevel} <br />
          Ready Time: {this.props.zombie.zombieReadyTime} <br />
          Wins: {this.props.zombie.zombieWinCount} <br />
          Losses: {this.props.zombie.zombieLossCount} <br />
          Owner: {this.truncate(this.props.zombie.zombieOwner, 12, 12)}
        </Card.Description>
      </Card.Content>
    );
  }
}
export default ZombieCardContent;
