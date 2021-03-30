//
// This is the "Change Name" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message } from "semantic-ui-react";
import ZombieCard from "../components/zombieCard";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class ChangeName extends Component {
  state = {
    value: "",
    message: "",
    errorMessage: "",
    loading: false,
    zombieId: null
  };


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
      await this.props.CZ.changeName(this.state.zombieId, this.state.value) // contains the zombie ID and the new name
      this.setState({
        loading: false,
        message: "Yay!!!!  I have a brand new name!"
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
        *<Header icon="browser" content="Please give me a WORTHY name!!" />
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
              <img src="static/images/nametag.jpg" alt="name tag" />
            </th>
          </tr>
        </table>
        <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>New Zombie Name</label>
            <input
              placeholder="Name"
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
            Change Name
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

export default connect(mapStateToProps)(ChangeName);
