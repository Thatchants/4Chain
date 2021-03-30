//
// This is the "Level Up" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message } from "semantic-ui-react";
import ZombieCard from "../components/zombieCard";

import { ethers } from "ethers";

function mapStateToProps(state) {
  return {
    web3Instance: state.web3Instance,
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class LevelUp extends Component {
  state = {
    value: "",
    message: "",
    errorMessage: "",
    loading: false,
    zombieId: null
  };

  // get a random cryptokitty image and the hungry zombie ID when the component mounts

  async componentDidMount() {
    let zombieId = +this.props.location.state.zombieId;
    this.setState({
      zombieId
    });
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      await this.props.CZ
        .levelUp(this.state.zombieId, {value: ethers.utils.parseEther(".001")})
      this.setState({
        loading: false,
        message: "Yay!!!!  I have more power!"
      });
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "User rejected transaction"
      });
    }
  };

  render() {
    return (
      <div>
        *
        <Header
          icon="browser"
          content="Please buy me some super-strength!!  It only costs .001 ether."
        />
        <table>
          <tr>
            <th>
              <ZombieCard
                zombieId={this.state.zombieId}
                zombieName={this.props.location.state.zombieName}
                zombieDNA={this.props.location.state.zombieDNA}
                zombieLevel={this.props.location.state.zombieLevel}
                zombieReadyTime={this.props.location.state.zombieReadyTime}
                zombieWinCount={this.props.location.state.zombieWinCount}
                zombieLossCount={this.props.location.state.zombieLossCount}
                zombieOwner={this.props.userAddress}
                myOwner={false}
              />
            </th>
            <th>
              <img
                src="static/images/LevelUp.jpg"
                width="400px"
                alt="LevelUp"
              />
            </th>
          </tr>
        </table>
        <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            <Icon name="check" />
            Level up!
          </Button>
          <Link to="/MyZombieInventory">
            <Button color="red" inverted>
              <Icon name="cancel" /> Close
            </Button>
          </Link>
          <hr />
          <h2>{this.state.message}</h2>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LevelUp);
