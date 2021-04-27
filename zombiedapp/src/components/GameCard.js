import React, { Component } from "react";
import { Icon, Card, Header, Modal, Button, Popup } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";
import ActionButton from "./ActionButton";
import GameCardContent from "./GameCardContent";

let WEEK_MS = 7 * 24 * 60 * 60 * 1000;

let EXPIRY_TIME = 1 * WEEK_MS

class GameCard extends Component {
  state = {
    modalOpen: false
  };

  modalOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose = () => this.setState({ modalOpen: false });

  render() {
    // define the button labels used in <ActionButton> further on down in the code

    const moveButton = (
      <div>
        Move
      </div>
    );
    const claimForfeitButton = (
      <div>
        Claim Forfeit
      </div>
    );

      return (
        <Card style={{ backgroundColor: ((this.props.turn % 2 === 1 && this.props.isPlayer1) || (this.props.turn % 2 === 0 && this.props.isPlayer2)) ? "LightGreen" : "LightYellow" }} raised>
          <ReactTooltip delayShow={400} />

          <a
            href="javascript:;"
            data-tip="Click on me to view actions for this Game"
            onClick={e => this.modalOpen(e)}
          >
            <GameCardContent game={this.props} />
          </a>

          {/* a modal is like an "alert", it's a popup that greys out the lower screen and displays its content on top of everything */}

          <Modal open={this.state.modalOpen} onClose={this.handleClose}>
            <Header
              icon="browser"
              content="These are the actions you can take for this game!"
            />

            <Modal.Content>
              <ActionButton
                pathname="/PlayingGame"
                buttonLabel={moveButton}
                data={this.props}
              />
              <ActionButton
                  pathname="/ClaimForfeit"
                  buttonLabel={claimForfeitButton}
                  data={this.props}
                  disableMe={new Date() - new Date(this.props.lastPlay) < EXPIRY_TIME}
              />
                
              

            </Modal.Content>

            <Modal.Actions>
              <Button color="red" onClick={this.handleClose} inverted>
                <Icon name="cancel" /> Close
              </Button>
            </Modal.Actions>
          </Modal>
        </Card>
      );
  }
}

export default GameCard;
