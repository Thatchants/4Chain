import React, { Component } from "react";
import getGameCount from "../utils/getGameCount";
import { connect } from "react-redux";

import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import { ethers } from "ethers";

function mapStateToProps(state) {
    return {
        CZ: state.CZ,
        userAddress: state.userAddress,
        userGameCount: state.userGameCount
    };
}

// Create a new Game

class CreateGame extends Component {
  state = {
    modalOpen: false,
    value: "",
    bet: "",
    message: "",
    errorMessage: "",
    loading: false
  };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      await this.props.CZ.createGame(this.state.value, {value: ethers.utils.parseEther(this.state.bet)}) // contains the opponent's address
      this.setState({
        loading: false,
        message: "You have sent out a new game invite"
      });
      getGameCount(this.props.CZ);
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "User rejected transaction or else this account is already in use, please try another address."
      });
    }
  };


  render() {
      return (
      <Modal
        trigger={
          <Button primary onClick={this.handleOpen}>
            Create Game
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Header icon="browser" content="Create a New Game" />
        <Modal.Content>
          <img src="static/images/4Chain_Greeting.png" alt="kids enjoying the power of blockchain" /><Header>Gambling is endorsed by Dr.Gersch!!!</Header>
          <br /> <br />
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Opponent Address</label>
              <input
                placeholder="Opponent Address (0x....)"
                onChange={event =>
                  this.setState({
                    value: event.target.value
                  })
                }
              />
            </Form.Field>
            <Form.Field>
            <label>Bet Amount</label>
              <input
                placeholder="Amount in ETH"
                onChange={event =>
                  this.setState({
                    bet: event.target.value
                  })
                }
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <Button primary type="submit" loading={this.state.loading} disabled={this.state.bet == ""}>
              <Icon name="check" />
              Create Game
            </Button>
            <hr />
            <h2>{this.state.message}</h2>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.handleClose} inverted>
            <Icon name="cancel" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(mapStateToProps)(CreateGame);
