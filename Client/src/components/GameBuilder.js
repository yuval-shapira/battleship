import "../App.css";
import React from "react";
import gameBuilderReducer from "../store/GameBuilder.Reducer";
import initTableGame from "../utils/InitTableGame";
//import EnterPlayerName from "./components/EnterPlayerName";
import GameBoard from "./GameBoard";
import LegendBoard from "./LegendBoard";

import { optionalDirections, suggesmentOption } from "../utils/PlaceShips.js";

export default function GameBuilder({highLevelDispatch, myName}) {
  const [host, gameBuilderDispatch] = React.useReducer(gameBuilderReducer, initTableGame());
  //const myName = "aaa";

  async function playButtonHandler(playerName) {
    highLevelDispatch({
      type: "START_GAME",
      payload: {
        player1: playerName,
        hostTable: host.table
      }
    });
    // try {
    //   const url = `http://localhost:3030/api/${playerName}`;
    //   const response = await fetch(url);
    //   const data = await response.json();
    //   return data;
    // } catch (err) {
    //   return false;
    // }
  }

  function removeShipHanler(shipID, x, y) {
    gameBuilderDispatch({
      type: "REMOVE_SHIP",
      payload: { shipID: shipID, x, y },
    });
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
      gameBuilderDispatch({
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
    gameBuilderDispatch({
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
      // call gameBuilderReducer for each cell to mark
      shipToPlace.forEach((cell) => {
        gameBuilderDispatch({
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
    <main className="flex-game-container">
          <h2>{myName}</h2>
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
          {host.numOfShipsPlaced === 10 && !host.gameStarted && (
            <button onClick={() => playButtonHandler()} className="d">
              Let's Play
            </button>
          )}
    </main>
  );
}
