//
// This is the "Attack Zombie" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message } from "semantic-ui-react";
import ZombieCard from "../components/zombieCard";
import getZombieCount from "../utils/getZombieCount";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class AttackZombie extends Component {
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
    let zombieLevel = +this.props.location.state.zombieLevel;
    this.setState({
      zombieId,
      zombieLevel
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
        .attack(this.state.zombieId, this.state.value) // contains the zombie ID and the target zombie ID
      let newZombie = await this.props.CZ
        .zombies(this.state.zombieId)

      if (this.state.zombieLevel < newZombie.level) {
        this.setState({
          loading: false,
          message: "Battle complete.  YOU WON!!!!"
        });
        getZombieCount(this.props.CZ, this.props.userAddress);
      } else {
        this.setState({
          loading: false,
          message: "Battle complete.  WAHHHH.  YOU LOST!!!!"
        });
      }
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message:
          "User rejected transaction or Cool Down period has not expired."
      });
    }
  };

  render() {
    return (
      <div>
        *
        <Header
          icon="browser"
          content="Enter opponent zombie ID!  If you win you bump up a level and create a new zombie !"
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
              {" "}
              <h2> &nbsp; &nbsp; Bite Me! &nbsp; &nbsp; </h2>
            </th>
            <th>
              <img
                src="static/images/zombieWinner3.jpg"
                width="300px"
                alt="zombie"
              />
            </th>
          </tr>
        </table>
        <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Opponent Zombie Id Number</label>
            <input
              placeholder="Zombie ID #"
              onChange={event =>
                this.setState({
                  value: event.target.value
                })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            <Icon name="check" />
            Attack Zombie
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

export default connect(mapStateToProps)(AttackZombie);
