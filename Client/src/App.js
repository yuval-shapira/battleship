import "./App.css";
import React from "react";
import reducer from "./store/Reducer";
import Cell from "./components/Cell";
//import log from '@ajar/marker';
import {
  optionalDirections,
  //checkChoosedDirection,
  // cellsToMark,
  // disableCellsAroundShip,
  suggesmentOption,
  //  checkIfNeedToBeDisable,
} from "./utils/PlaceShips.js";

function initTableGame() {
  //BOARD
  const initTableGame = [];
  for (let i = 0; i < 11; i++) {
    initTableGame.push([]);
    for (let j = 0; j < 11; j++) {
      initTableGame[i].push({
        className: "",
        cellStatus: "",
        disable: false,
        shipID: null,
        toRemove: false,
      });
    }
  }
  //AXES
  initTableGame[0][0].cellStatus = "axe";
  for (let i = 1; i < 11; i++) {
    initTableGame[0][i].axe = i;
    initTableGame[0][i].cellStatus = "axe";
    initTableGame[0][i].disable = true;
    initTableGame[i][0].axe = (i + 9).toString(36).toUpperCase();
    initTableGame[i][0].cellStatus = "axe";
    initTableGame[i][0].disable = true;
  }
  const legendArray = [
    {
      shipID: "ship-4-1",
      className: "ship-4",
      shipSize: 4,
      shipNum: 1,
      isPlaced: null,
    },
    {
      shipID: "ship-3-2",
      className: "ship-3",
      shipSize: 3,
      shipNum: 2,
      isPlaced: null,
    },
    {
      shipID: "ship-3-1",
      className: "ship-3",
      shipSize: 3,
      shipNum: 1,
      isPlaced: null,
    },
    {
      shipID: "ship-2-3",
      className: "ship-2",
      shipSize: 2,
      shipNum: 3,
      isPlaced: null,
    },
    {
      shipID: "ship-2-2",
      className: "ship-2",
      shipSize: 2,
      shipNum: 2,
      isPlaced: null,
    },
    {
      shipID: "ship-2-1",
      className: "ship-2",
      shipSize: 2,
      shipNum: 1,
      isPlaced: null,
    },
    {
      shipID: "ship-1-4",
      className: "ship-1",
      shipSize: 1,
      shipNum: 4,
      isPlaced: null,
    },
    {
      shipID: "ship-1-3",
      className: "ship-1",
      shipSize: 1,
      shipNum: 3,
      isPlaced: null,
    },
    {
      shipID: "ship-1-2",
      className: "ship-1",
      shipSize: 1,
      shipNum: 2,
      isPlaced: null,
    },
    {
      shipID: "ship-1-1",
      className: "ship-1",
      shipSize: 1,
      shipNum: 1,
      isPlaced: null,
    },
  ];
  return {
    legend: legendArray,
    table: initTableGame,
    selectedShip: {
      shipID: null,
      shipSize: null,
      shipNum: null,
      x: null,
      y: null,
    },
    firstPlaced: false,
  };
}

export default function App() {
  const [host, dispatch] = React.useReducer(reducer, initTableGame());
  //const [step, setStep] = useState(0)
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
        <div className="flex-host-container">
          {/* !!!!!!! LEGEND !!!!!!!! */}
          <div className="legend">
            {host.legend.map((ship) => {
              const className = ship.isPlaced
                ? `${ship.className} placed`
                : ship.className;
              return (
                <span
                  id={ship.shipID}
                  className={className}
                  onClick={() =>
                    selectShipHandler(ship.shipID, ship.shipSize, ship.shipNum)
                  }
                ></span>
              );
            })}
          </div>
          {/* !!!!!!! GAME !!!!!!!! */}
          <div className="game-grid">
            {host.table.map((row, x) => (
              <div className="row" key={x}>
                {row.map((cell, y) => (
                  <Cell
                    key={`${x}${y}`}
                    cell={cell}
                    x={x}
                    y={y}
                    handleClick={handleClick}
                    mouseHandler={mouseHandler}
                  />
                ))}
                {/* add class name logic - start with change className to status... */}
              </div>
            ))}
          </div>
        </div>
        {}
      </main>
    </div>
  );
}
