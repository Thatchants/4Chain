import React, { Component } from "react";

class Greeting extends Component {
  render() {
    const imgStyle = {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%"
    };

    return (
      <div>
        <br />
        <h2 style={{ color: "#0075D3", textAlign: "center" }}>
          {" "}
          Welcome to <b style={{color: "Orange"}}> 4Chain</b>! - A postmodern take on Connect 4 featuring a cryptographic ledger!
        </h2>
        <br />
        <img src="static/images/4Chain_Greeting.png" style={imgStyle} width="200px" alt="Hardcore 4Chain enthusiasts" />
        <br /> <br />
        <p style={{ textAlign: "center" }}>
          This blockchain game allows you to play Connect 4 for money using the Ethereum blockchain.
          <br /> You can play against anyone with an Ethereum address for any amount of Ethereum.
          <br /> Every game requires both players to put an equal amount of money into the game pool. No need to worry about cheating or getting your money back! If the other player is inactive you will be rewarded with the full prize money.
          <br /> <br /> To get started, select a button from the menu bar above.
        </p>
      </div>
    );
  }
}

export default Greeting;
