import React, { Component } from "react";
import { Icon, Card, Header, Modal, Button, Popup } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";
import ActionButton from "./ActionButton";
import GameCardContent from "./GameCardContent";

import { connect } from "react-redux";

let WEEK_MS = 7 * 24 * 60 * 60 * 1000;

let EXPIRY_TIME = 1 * WEEK_MS

function mapStateToProps(state) {
  return {
    CZ: state.CZ
  };
}

class GameCard extends Component {
  state = {
    modalOpen: false
  };

  // modalOpen() {
  //   this.setState({ modalOpen: true });
  // }

  // handleClose = () => this.setState({ modalOpen: false });

  setModal = (b) => {
    this.setState({modalOpen: b});
  }

  onForfeit = async () => {
    await this.props.CZ.claimForfeit(this.props.gameNumber);
  }

  getColor = () => {
    // case winner
    if ((this.props.finishState == 1 && this.props.isPlayer1) || (this.props.finishState == 2 && this.props.isPlayer2)) {
      return 'olivedrab';
    }
    // case lost
    if ((this.props.finishState == 1 && this.props.isPlayer2) || (this.props.finishState == 2 && this.props.isPlayer1)) {
      return 'indianred';
    }

    //case tie
    if (this.props.finishState == 3) {
      return 'lightyellow';
    }

    // IF NOT ABOVE THEN IN PROGRESS
    // case their turn
    if ((this.props.turn % 2 === 1 && this.props.isPlayer1) || (this.props.turn % 2 === 0 && this.props.isPlayer2)) {
      return 'cadetblue';
    }
    
    // case not their turn
    return 'coral';
  }

  getHeader() {
    if (this.props.finishState == 0) {
      return "These are the actions you can take for this game!";
    }
    let s = "Loss"

    if ((this.props.finishState == 1 && this.props.isPlayer1) || (this.props.finishState == 2 && this.props.isPlayer2)) {
      s = "Win"
    }

    if (this.props.finishState == 3) {
      s = "Tie"
    }

    return "Game " + this.props.gameNumber + " ended in a " + s + "!";
    
  }

  render() {
    // define the button labels used in <ActionButton> further on down in the code

    const moveButton = (
      <div>
        Move
      </div>
    );
    const viewButton = (
      <div>
        View
      </div>
    );
    const claimForfeitButton = (
      <div>
        Claim Forfeit
      </div>
    );

      return (
        <Modal open={this.state.modalOpen} onClose={() => this.setModal(false)} onOpen={() => this.setModal(true)} trigger={
          <Card style={{ backgroundColor: this.getColor()}} raised onClick={e => this.setModal(true)}>
          <ReactTooltip delayShow={400} />

          {/* <div
            data-tip="Click on me to view actions for this Game"
            onClick={e => this.modalOpen(e)}
          > */}
            <GameCardContent game={this.props} />
          {/* </div> */}

          {/* a modal is like an "alert", it's a popup that greys out the lower screen and displays its content on top of everything */}

          
        </Card>}>
            <Header
              icon="browser"
              content={this.getHeader()}
            />

            <Modal.Content>
              <ActionButton
                pathname="/PlayingGame"
                buttonLabel={this.props.finishState == 0 ? moveButton : viewButton}
                data={this.props}
              />
              <Button primary onClick={this.onForfeit} disabled={new Date() - new Date(this.props.lastPlay) < EXPIRY_TIME}>
              <div>
                Claim Forfeit
              </div>
              </Button>
                
              

            </Modal.Content>

            <Modal.Actions>
              <Button color="red" onClick={e => this.setModal(false)} inverted>
                <Icon name="cancel" /> Close
              </Button> 
            </Modal.Actions>
          </Modal>
        
      );
  }
}

export default connect(mapStateToProps)(GameCard);
