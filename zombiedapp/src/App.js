import React, { Component } from "react";
import initBlockchain from "./utils/initBlockchain";
import getGameCount from "./utils/getGameCount";

import { HashRouter, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Provider } from "react-redux";

import TopBar from "./components/TopBar";

import Greeting from "./pages/Greeting";
import MyGameInventory from "./pages/MyGameInventory";
import GameDisplay from "./pages/GameDisplay";

import store from "./redux/store";

//
//  This is the main application page; routing is handled to render other pages in the application

class App extends Component {
  // define a state variable for important connectivity data to the blockchain
  // this will then be put into the REDUX store for retrieval by other pages

  // **************************************************************************
  //
  // React will call this routine only once when App page loads; do initialization here
  //
  // **************************************************************************


    componentDidMount = async () => {
      try {
          const CZInfo = await initBlockchain(); // from utils directory;  connect to provider and to metamask or other signer
          await getGameCount(CZInfo.CZ); // get user count and total count of zombies
      } catch (error) {
          // Catch any errors for any of the above operations.
          alert(`Failed to load provider, signer, or contract. Check console for details.`);
          console.log(error);
      }
    };





  // **************************************************************************
  //
  // main render routine for App component;
  //      contains route info to navigate between pages
  //
  // **************************************************************************

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Container>
            <TopBar state={this.state} />
            <div>
              <Route exact path="/" component={Greeting} />
              <Route
                exact
                path="/myGameInventory"
                component={MyGameInventory}
              />
              {/* routes used in game action modal */}
              <Route exact path="/PlayingGame" component={GameDisplay} />
              {/* <Route exact path="/AttackZombie" component={AttackZombie} />
              <Route exact path="/FeedOnKitty" component={FeedOnKitty} />
              <Route exact path="/ChangeName" component={ChangeName} />
              <Route exact path="/LevelUp" component={LevelUp} />
              <Route exact path="/TransferZombie" component={TransferZombie} /> */}
            </div>
          </Container>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
