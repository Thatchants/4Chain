import React, { Component } from "react";
import { Card, Grid, Input, Segment, Pagination, Icon, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import GameCard from "../components/GameCard";
import {parseBoard} from "../utils/parseBoardState";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userGameCount: state.userGameCount,
    userAddress: state.userAddress
  };
}

class MyGameInventory extends Component {
  state = {
    gameTable: [],
    activePage: 1,
    totalPages: Math.ceil(this.props.userGameCount / 9),
    refreshLoading: false
  };

  componentDidMount = async () => {
    await this.makeGameCards();
  };

  onChange = async (e, pageInfo) => {
    await this.setState({ activePage: pageInfo.activePage });
    this.makeGameCards();
  };

  handleInputChange = async (e, { value }) => {
    await this.setState({ activePage: value });
    this.makeGameCards();
  };

  onRefresh = async () => {
    await this.setState({ refreshLoading: true});
    await this.makeGameCards();
    await this.setState({ refreshLoading: false});
  }

  makeGameCards = async () => {
    let gameTable = [];
    for (
      var i = this.state.activePage * 9 - 9;
      i < this.state.activePage * 9;
      i++
    ) {
      try {
        let id = await this.props.CZ.playerToKey(this.props.userAddress, i);
        id = parseInt(id);
        let game = await this.props.CZ.keyToGame(id);
        let data = await this.props.CZ.getGameState(id);
        let board = parseBoard(data);
        let lastPlay = new Date(game.lastPlayedTimestamp * 1000).toLocaleString();
        gameTable.push(
          <GameCard
            key={id}
            gameNumber={id}
            player1={game.player1}
            player2={game.player2}
            turn={game.turn}
            pot={game.pot.toString()}
            lastPlay={lastPlay}
            boardState={board}
            isPlayer1={game.player1 == this.props.userAddress}
            isPlayer2={game.player2 == this.props.userAddress}
          />
        );
      } catch {
        break;
      }
    }
    this.setState({ gameTable });
  };

  render() {
    return (
      <div>
        <Grid columns='equal'>
          <Grid.Row style={{paddingBottom:0}}>
            <Grid.Column width={10}>
              <h2> Your Active Games </h2>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button primary circular loading={this.state.refreshLoading} icon='sync' onClick={this.onRefresh}/>
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row style={{paddingTop:0}}>
            <Grid.Column>
              Clicking anywhere on a card will bring up a list of actions you can perform. It is your turn in games with green cards.
            </Grid.Column>
          </Grid.Row>
          
        </Grid>
        <hr />
        
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column>
            <Segment secondary>
              <div>activePage: {this.state.activePage}</div>
              <Input
                min={1}
                max={this.state.totalPages}
                onChange={this.handleInputChange}
                type="range"
                value={this.state.activePage}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Pagination
              activePage={this.state.activePage}
              onPageChange={this.onChange}
              totalPages={this.state.totalPages}
            />
          </Grid.Column>
        </Grid>
        <br /> <br />
        <Card.Group> {this.state.gameTable} </Card.Group>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyGameInventory);
