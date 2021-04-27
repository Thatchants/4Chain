//
// This is the "Make a move" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message, Label } from "semantic-ui-react";

import getGameCount from "../utils/getGameCount";

import { truncate } from "../utils/truncate";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class GameDisplay extends Component {
  state = {
    value: "",
    message: "",
    errorMessage: "",
    loading: false
  };


  onMove = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      let val = parseInt(this.state.value);
      if ((this.props.location.state.isPlayer2 && this.props.location.state.turn === 0)) {
        await this.props.CZ.accept(this.props.location.state.gameNumber, val, {value: parseInt(this.props.location.state.pot)})
      } else {
        await this.props.CZ.play(this.props.location.state.gameNumber, val)
      }
      this.setState({
        loading: false,
        message: "You have sent a move request"
      });
      getGameCount(this.props.CZ);
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "Invalid move request."
      });
    }
  };

  render() {
    return (
      <div>
        <Header as='h1' content={this.props.location.state.player1 + " VS " + this.props.location.state.player2} ></Header>
        {this.props.location.state.boardState}
        <Form onSubmit={this.onMove} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Move</label>
              <input
                placeholder="Col (Temporary UI for functionality)"
                onChange={event =>
                  this.setState({
                    value: event.target.value
                  })
                }
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <Button primary type="submit" loading={this.state.loading} disabled={this.state.value === ""}>
              <Icon name="check" />
              {(this.props.location.state.isPlayer2 && this.props.location.state.turn === 0) ? "Accept" : "Move"}
            </Button>
            {(this.props.location.state.isPlayer2 && this.props.location.state.turn === 0) ? <Label pointing='left'>The bet amount {this.props.location.state.pot} must be matched</Label> : <div/>}
            <hr />
            <h2>{this.state.message}</h2>
          </Form>
        
      </div>
    );
  }
}

export default connect(mapStateToProps)(GameDisplay);
