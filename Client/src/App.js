import "./App.css";
import React, { useEffect, useRef } from "react";
import highLevelReducer from "./store/HighLevelReducer";
import {initOpponentTableGame, initOpponentLegend} from "./utils/InitTableGame";
import EnterPlayerName from "./components/EnterPlayerName";
import GameBuilder from "./components/GameBuilder";
import PlayGame from "./components/PlayGame";

import io from "socket.io-client";

const initHighLevelState = {
  gameState: "ENTER_NAME",
  myName: null,
  opponentName: "Hard Coded Player",
  myTable: [],
  myLegend: [],
  opponentTable: initOpponentTableGame(),
  opponentLegend: initOpponentLegend(),
  gameOver: false,
  winner: null,
};

export default function App() {
  const [highLevelState, highLevelDispatch] = React.useReducer(
    highLevelReducer,
    initHighLevelState
  );

  function stateRender(highLevelState, highLevelDispatch) {
    switch (highLevelState.gameState) {
      case "ENTER_NAME":
        return <EnterPlayerName highLevelDispatch={highLevelDispatch} />;
      //case "WAITING_FOR_OPPONENT":
      //  return <WaitingForOpponent highLevelDispatch={highLevelDispatch} />;
      case "PLACE_SHIPS":
        return (
          <GameBuilder
            highLevelDispatch={highLevelDispatch}
            myName={highLevelState.myName}
            opponentName={highLevelState.opponentName}
            opponentTable={highLevelState.opponentTable}
            opponentLegend={highLevelState.opponentLegend}
          />
        );
      case "GAME_STARTED":
        return (
          <PlayGame
            game={highLevelState}
            highLevelDispatch={highLevelDispatch}
          />);
      // case "GAME_OVER":
      //  return <GameOver highLevelDispatch={highLevelDispatch} />;
      default:
        return <div>Error</div>;
    }
  }

  useEffect(() => {
    const socket = io("ws://localhost:3030");
    socket.on("connect", () => {
         console.log("connected", socket.id);
    });
    socket.on("server-msg", (message) => {
      console.log(message);
    });
    socket.on("client-msg", (data) => {
      console.log("DATA: ", data);
    });
  }, []);

  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to BattleShip</h1>
      </header>
      {stateRender(highLevelState, highLevelDispatch)}
    </div>
  );
}
