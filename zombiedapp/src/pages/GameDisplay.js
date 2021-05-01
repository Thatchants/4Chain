//
// This is the "Make a move" page
//

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message, Label, Grid, Modal } from "semantic-ui-react";

import {parseBoard} from "../utils/parseBoardState";

import getGameCount from "../utils/getGameCount";

import { truncate } from "../utils/truncate";
import { ethers } from "ethers";

/* global BigInt */

function mapStateToProps(state)  {
  return {
    CZ: state.CZ,
    userAddress: state.userAddress
  };
}

class GameDisplay extends Component {
  state = {
    value: 0,
    message: "",
    errorMessage: "",
    loading: false,
    refreshLoading: false,
    board: [[],[],[],[],[],[]],
    acceptModal: false
    
  };

  onRefresh = async () => {
    await this.setState({ refreshLoading: true});
    let data = await this.props.CZ.getGameState(this.props.location.state.gameNumber);
    let board = parseBoard(data);
    await this.setState({ board: board, refreshLoading: false});
  }

  acceptModalToggle(boo) {
    this.setState({acceptModal: boo});
  }

  componentDidMount = async () => {
    await this.onRefresh();
  };

  play = async (c) => {
    await this.setState({value: c, loading: true, errorMessage: "", message: "waiting for blockchain transaction to complete..."});
    if ((this.props.location.state.isPlayer2 && this.props.location.state.turn === 0)) {
      await this.acceptModalToggle(true);
    } else {
      try {
        await this.props.CZ.move(this.props.location.state.gameNumber, c);
        this.setState({
          loading: false,
          message: "You have sent a move request"
        });
      } catch (e) {
        this.setState({
          loading: false,
          errorMessage: e.message,
          message: "Invalid move request."
        });
      }
     
    }
  }

  onAccept = async () => {
    try {
      const num = ethers.utils.bigNumberify(this.props.location.state.pot);
      await this.props.CZ.accept(this.props.location.state.gameNumber, this.state.value, {value: ethers.utils.parseEther(ethers.utils.formatEther(num))})
      this.setState({
        loading: false,
        message: "You have sent a move request"
      });
    } catch (e) {
      this.setState({
        loading: false,
        errorMessage: e.message,
        message: "Invalid move request."
      });
    }
  }

  onMove = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      let val = this.state.value;
      // is this an acceptance?
      if ((this.props.location.state.isPlayer2 && this.props.location.state.turn === 0)) {
        await this.props.CZ.accept(this.props.location.state.gameNumber, val, {value: parseInt(this.props.location.state.pot)})
      } else {
        await this.props.CZ.move(this.props.location.state.gameNumber, val)
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
        <Grid columns="equal">
          <Grid.Column width={10}>
            <Header textAlign="left" as='h1' content={truncate(this.props.location.state.player1, 4, 4) + " VS " + truncate(this.props.location.state.player2,4,4)} ></Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button primary circular loading={this.state.refreshLoading} icon='sync' onClick={this.onRefresh}/>
          </Grid.Column>
        </Grid>
        <Grid columns="7" textAlign="center" verticalAlign="middle">
          {this.state.board.map((r, i) => {return <Grid.Row key={i}>
            {r.map((v, j) => { return (
                <Grid.Column key={j} color="blue">
                  <Icon color={v == 2 ? "yellow" : (v == 1 ? "red" : "white")} size="huge" name="circle" onClick={() => { if (this.props.location.state.finishState == 0) this.play(j)}}/>
                  
                </Grid.Column>)})}
          </Grid.Row>})}
        </Grid>
        <Modal
          onClose={ () => this.acceptModalToggle(false)}
          onOpen={ () => this.acceptModalToggle(true)}
          open={this.state.acceptModal}
        >
              <Modal.Content>
                To accept this game you need to match a {this.props.location.pot} wei bet.
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.acceptModalToggle(false)}>Cancel</Button>
                <Button onClick={() => this.onAccept().then(() => {this.acceptModalToggle(false)})}>Accept</Button>
              </Modal.Actions>
        </Modal>
        <hr/>
        {this.state.errorMessage}
      </div>
    );
  }
}
export default connect(mapStateToProps)(GameDisplay);
