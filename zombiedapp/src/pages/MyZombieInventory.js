import React, { Component } from "react";
import { Card, Grid, Input, Segment, Pagination } from "semantic-ui-react";
import { connect } from "react-redux";
import ZombieCard from "../components/zombieCard";

function mapStateToProps(state) {
  return {
    CZ: state.CZ,
    userZombieCount: state.userZombieCount,
    userAddress: state.userAddress
  };
}

class MyZombieInventory extends Component {
  state = {
    ZombieTable: [],
    activePage: 1,
    totalPages: Math.ceil(this.props.userZombieCount / 9)
  };

  componentDidMount = async () => {
    await this.makeZombieCards();
  };

  onChange = async (e, pageInfo) => {
    await this.setState({ activePage: pageInfo.activePage });
    this.makeZombieCards();
  };

  handleInputChange = async (e, { value }) => {
    await this.setState({ activePage: value });
    this.makeZombieCards();
  };
  makeZombieCards = async () => {
    const myZombies = await this.props.CZ.getZombiesByOwner(this.props.userAddress);
    let zombieTable = [];
    for (
      var i = this.state.activePage * 9 - 9;
      i < this.state.activePage * 9;
      i++
    ) {
      try {
        let z = myZombies[i];
        let zombie = await this.props.CZ.zombies(z);
        let myDate = new Date(zombie.readyTime * 1000).toLocaleString();
        zombieTable.push(
          <ZombieCard
            key={z}
            zombieId={z.toString()}
            zombieName={zombie.name}
            zombieDNA={zombie.dna.toString()}
            zombieLevel={zombie.level}
            zombieReadyTime={myDate}
            zombieWinCount={zombie.winCount}
            zombieLossCount={zombie.lossCount}
            zombieOwner={this.props.userAddress}
            myOwner={true}
          />
        );
      } catch {
        break;
      }
    }
    this.setState({ zombieTable });
  };

  render() {
    return (
      <div>
        <hr />
        <h2> Your Zombie Inventory </h2>
        The zombies you own have a yellow background; clicking anywhere on a
        yellow card will bring up a list of actions you can perform.
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
        <Card.Group> {this.state.zombieTable} </Card.Group>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyZombieInventory);
