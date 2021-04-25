import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Button } from "semantic-ui-react";

import CreateGame from "./CreateGame";

import { Menu, Header } from "semantic-ui-react";

function mapStateToProps(state) {
  return {
    userAddress: state.userAddress,
    userGameCount: state.userGameCount
  };
}

// This renders the topbar on the webpage as well as the lines listing address and game count.

class TopBar extends Component {
  render() {
    return (
      <div>
        <Menu style={{ marginTop: "10px", backgroundColor: "Orange" }}>
          <Menu.Item>
            <CreateGame />
          </Menu.Item>

          <Menu.Item>
            <Link to={{ pathname: "/myGameInventory" }}>
              <Button primary>Show My Games</Button>
            </Link>
          </Menu.Item>

          <Menu.Item position="right">
            <Link to={{ pathname: "/" }}>
              <Header size="large">4Chain</Header>
            </Link>
          </Menu.Item>
        </Menu>
        <div className="center">
          <h2>Greatest game ever!</h2>
        </div>
        Your account address: {this.props.userAddress}
        <br />
        You are currently playing {this.props.userGameCount} game(s) of Connect 4!
        <hr />
      </div>
    );
  }
}

export default connect(mapStateToProps)(TopBar);
