//
// This is the "Feed On Random Cryptokitty" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Icon, Form, Message } from "semantic-ui-react";
import ZombieCard from "../components/zombieCard";
import getZombieCount from "../utils/getZombieCount";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class FeedOnKitty extends Component {
  state = {
    value: "",
    message: "",
    errorMessage: "",
    loading: false,
    kittyImage: "",
    hungryZombieId: null,
    zombieName: "",
    zombieDNA: 0
  };

  // get a random cryptokitty image and the hungry zombie ID when the component mounts

  async componentDidMount() {
    let hungryZombieId = +this.props.location.state.zombieId;
    let url =
      "https://api.cryptokitties.co/kitties/" +
      Math.floor(Math.random() * 10000) +
      1;
    this.setState({ message: url });
    const res = await fetch(url);
    const kitty = await res.json();
    this.setState({
      kittyImage: kitty.image_url,
      hungryZombieId
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
      await this.props.CZ.feedOnKitty(this.state.hungryZombieId, 0) // contains the zombie ID and a 0 for kitty ID since contract is random
      this.setState({
        loading: false,
        message: "You have eaten a poor innocent CryptoKitty.   Buuuuurrrrpp!!!"
      });
      getZombieCount(this.props.CZ, this.props.userAddress);
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
        {/*<Header icon="browser" content="Feed on Random CryptoKitty" /> */}
        <h2>Oh No! A Zombie! Please do not eat me!!!</h2>
        <table>
          <tr>
            <th>
              <ZombieCard
                zombieId={this.state.hungryZombieId}
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
              <img src={this.state.kittyImage} width="400px" alt="CryptoKitty Victim" />
            </th>
          </tr>
        </table>
        <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            <Icon name="check" />
            Eat CryptoKitty
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

export default connect(mapStateToProps)(FeedOnKitty);
