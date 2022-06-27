import "./App.css";
import React, { useEffect } from "react";
import reducer from "./store/GameBuilder.Reducer";
import initTableGame from "./utils/InitTableGame";
//import EnterPlayerName from "./components/EnterPlayerName";
import GameBoard from "./components/GameBoard";
import LegendBoard from "./components/LegendBoard";

import { optionalDirections, suggesmentOption } from "./utils/PlaceShips.js";

import io from "socket.io-client";
//const socket = io.connect("http://localhost:3030");

export default function App() {
  const [host, dispatch] = React.useReducer(reducer, initTableGame());
  //const [step, setStep] = useState(0)
  //const [name, setName] = React.useState("");

  async function playButtonHandler(playerName) {
    dispatch({
      type: "START_GAME",
    });
    host.gameStarted = true;
    try {
      const url = `http://localhost:3030/api/${playerName}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      return false;
    }
  }
  // function handleNameChange(e) {
  //   const value = e.target.value;
  //   console.log("e.target.value: ", value);
  //   setName(value);
  // }
  function handleFormSubmit(e) {
    e.preventDefault();
  const formData = new FormData(e.target);
  const {player1} = Object.fromEntries(formData);
    //console.log("formProps: ", formProps);
    //console.log("name: ", name);
    if (player1 !== "") {
      dispatch({
        type: "ENTER_NAME",
        payload: {
          player1,
        },
      });
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
      console.log("DATA: ",data);
    });
  }, []);

  function removeShipHanler(shipID, x, y) {
    dispatch({
                    type: "REMOVE_SHIP",
                    payload: { shipID: shipID, x, y },
                  })
  }
  
  function handleClick(x, y) {
    if (x !== 0 && y !== 0) {
      let reducerType = "";
      if (
        host.selectedShip.shipID === null &&
        host.table[x][y].shipID !== null
      ) {
        reducerType = "BUTTON_REMOVE_SHIP";
      }
      if (
        host.selectedShip &&
        !host.firstPlaced &&
        host.table[x][y].shipID === null
      ) {
        reducerType = "FIRST_PLACED";
      }
      if (
        host.selectedShip &&
        host.firstPlaced &&
        host.table[x][y].shipID === null
      ) {
        reducerType = "FULL_PLACED";
      }
      dispatch({
        type: reducerType,
        payload: {
          x,
          y,
          //className: "cell placed-ship",
        },
      });
    }
  }

  function selectShipHandler(shipID, shipSize, shipNum) {
    for (let i = 0; i < host.legend.length; i++) {
      if (
        host.legend[i].shipID === shipID &&
        host.legend[i].isPlaced === true &&
        host.legend[i].toRemove !== false
      ) {
        return;
      }
    }
    //if (host.shipID !== shipID) {
    dispatch({
      type: "SELECT_SHIP",
      payload: {
        shipID,
        shipSize,
        shipNum,
      },
    });
    //}
  }

  function mouseHandler(action, x, y) {
    if (host.selectedShip.shipID || host.firstPlaced) {
      //return all posible directions
      const directions = optionalDirections(
        host.table,
        x,
        y,
        host.selectedShip,
        host.firstPlaced
      );
      //return array with all the cells to mark in green
      const shipToPlace = suggesmentOption(
        directions,
        x,
        y,
        host.selectedShip.shipSize
      );
      // call reducer for each cell to mark
      shipToPlace.forEach((cell) => {
        dispatch({
          type: action,
          payload: {
            x: cell.x,
            y: cell.y,
          },
        });
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to BattleShip</h1>
      </header>
      <main className="flex-game-container">
        {host.player1 === null ? (
          // <EnterPlayerName
          // handleNameChange={handleNameChange}
          // handleFormSubmit={handleFormSubmit}/>
          <form onSubmit={handleFormSubmit}>
            <label>
              Your Name:
              <input
                //onChange={(e) => handleNameChange(e)}
                type="text"
                name="player1"
                placeholder="Enter your name"
              />
            </label>
            <input type="submit" value="Submit" />
            {/* <button onClick={handleFormSubmit}>Submit</button> */}
          </form>
        ) : (
          <>
            <h2>Player 1: {host.player1}</h2>
            <div className="flex-host-container">
              {/* !!!!!!! LEGEND !!!!!!!! */}
              <LegendBoard
                legendTable={host.legend}
                selectShipHandler={selectShipHandler}
              />
              {/* !!!!!!! GAME !!!!!!!! */}
              <GameBoard
                table={host.table}
                handleClick={handleClick}
                mouseHandler={mouseHandler}
                removeShipHanler={removeShipHanler}
              />
            </div>
            {(host.numOfShipsPlaced === 10 && !host.gameStarted) &&
              <button onClick={() => playButtonHandler()} className="d">
              Let's Play
            </button>}
          </>
        )}
      </main>
    </div>
  );
}
