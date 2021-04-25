//
// This is the "Make a move" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message } from "semantic-ui-react";
import getGameCount from "../utils/getGameCount";

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
    loading: false,
  };

  render() {
    return (
      <div>
        {this.props.location.state.boardState}
      </div>
    );
  }
}

export default connect(mapStateToProps)(GameDisplay);
