import "./App.css";
import React from "react";
//import log from '@ajar/marker'; 
import { optionalDirections, checkChoosedDirection, cellsToMark, disableCellsAroundShip, suggesmentOption } from "./Utils/PlaceShips.mjs";

function initTableGame() {
  //BOARD
  const initTableGame = [];
  for (let i = 0; i < 11; i++) {
    initTableGame.push([]);
    for (let j = 0; j < 11; j++) {
      initTableGame[i].push({
        className: "cell",
        disable: false,
        shipID: null});
    }
  }
  for (let i = 1; i < 11; i++) {
    initTableGame[0][i].axe = i;
    initTableGame[i][0].axe = i;
  }
  //LEGEND
  // const initLegendBoard = [];
  // for (let i = 0; i < 10; i++) {
  //   initLegendBoard.push({});
  // }

  return {
    legend: [],
    table: initTableGame,
    selectedShip: null,
    firstPlaced: false,
  };
}

function reducer(state, { type, payload }) {
  console.log(state);
  switch (type) {
    case "SELECT_SHIP":
      const shipIndexInLegend = state.legend.findIndex((ship) => ship.shipID === payload.shipID);
      if(state.legend[shipIndexInLegend]?.isPlaced === true) {
        return state;
      }
      return {
        ...state,
        selectedShip: {
          shipID: payload.shipID,
          shipSize: payload.shipSize,
          shipNumber: payload.shipNumber,
          x: null,
          y: null,
        },
        firstPlaced: false,
      };
    case "FIRST_PLACED":
      const firstPlacedState = { ...state };
      if(firstPlacedState.table[payload.x][payload.y].disable === false) {
        firstPlacedState.table[payload.x][payload.y].shipID =
          firstPlacedState.selectedShip.shipID;
        console.log(`className A: ${firstPlacedState.table[payload.x][payload.y].className}`);
        firstPlacedState.table[payload.x][payload.y].className = payload.className;
        console.log(`className B: ${firstPlacedState.table[payload.x][payload.y].className}`);
      //בנוסף, יש לשמור את הספינה ב'מיקרא'

      firstPlacedState.selectedShip.x = payload.x;
      firstPlacedState.selectedShip.y = payload.y;

      if (firstPlacedState.selectedShip.shipSize === 1) {
        firstPlacedState.selectedShip = null;
      }else{
        firstPlacedState.firstPlaced = true;
      }
    }
      return firstPlacedState;

    case "FULL_PLACED":
      const fullPlacedState = { ...state };
      const directions = optionalDirections(fullPlacedState.table, fullPlacedState.selectedShip.x, fullPlacedState.selectedShip.y, fullPlacedState.selectedShip.shipSize);
      if (directions.length !== 0) {
        const choosedDirection = checkChoosedDirection(fullPlacedState.selectedShip.x, fullPlacedState.selectedShip.y, fullPlacedState.selectedShip.shipSize, payload);
        const legitOption = directions.findIndex((direction) => direction === choosedDirection);
        if (legitOption !== -1) {
          const shipToPlace = cellsToMark(choosedDirection, fullPlacedState.selectedShip.x, fullPlacedState.selectedShip.y, fullPlacedState.selectedShip.shipSize);
          shipToPlace.forEach((cell) => {
            fullPlacedState.table[cell.x][cell.y].shipID = state.selectedShip.shipID;
            fullPlacedState.table[cell.x][cell.y].className = payload.className;            
          });
          const disableAroundShip = disableCellsAroundShip(shipToPlace);
          disableAroundShip.forEach((cell) => {
            fullPlacedState.table[cell.x][cell.y].disable = true;
          })

      //Mark ship as placed in legend
      const shipInLegend = fullPlacedState.legend.findIndex((ship) => ship.shipID === fullPlacedState.selectedShip.shipID);

      shipInLegend === -1 ? 
      fullPlacedState.legend.push({
        shipID: fullPlacedState.selectedShip.shipID,
        shipSize: fullPlacedState.selectedShip.shipSize,
        shipNumber: fullPlacedState.selectedShip.shipNumber,
        isPlaced: true
      }) : fullPlacedState.legend[shipInLegend].isPlaced = true;
      
      fullPlacedState.selectedShip = null;
      fullPlacedState.firstPlaced = false;
        }
      } 
      return fullPlacedState;

    case "MOUSE_OVER":
      const mouseOverState = { ...state };

    default:
      return state;
  }
}

export default function App() {
  const [host, dispatch] = React.useReducer(reducer, initTableGame());

  function handleClick(x, y) {
    if (x !== 0 && y !== 0) {
      // console.log(host.selectedShip);
      // console.log(!host.firstPlaced);

      let reducerType = "";

      if (host.selectedShip && !host.firstPlaced) {
        reducerType = "FIRST_PLACED";
      }
      if (host.selectedShip && host.firstPlaced) {
        reducerType = "FULL_PLACED";
      }
      // console.log(host);
      dispatch({
        type: reducerType,
        payload: {
          x,
          y,
          className: "cell placed-ship",
        },
      });
    }
  }

  function selectShipHandler(shipID, shipSize, shipNumber) {
   // console.log(`host.selectedShip: ${host.selectedShip}`);
    for (let i = 0; i < host.legend.length; i++) {
      if (
        host.legend[i].shipID === shipID &&
        host.legend[i].isplaced === true
      ) {
        return;
      }
    }
    if (host.shipID !== shipID) {
      dispatch({
        type: "SELECT_SHIP",
        payload: {
          shipID,
          shipSize,
          shipNumber,
        },
      });
    }
  }

function mouseHandler(action,x, y){
  if (host.selectedShip?.shipID) {
    console.log(`mouseOverHandler: ${x}, ${y}`);
    const directions = optionalDirections(host.table, x, y, host.selectedShip.shipSize);
    console.log(`directions: ${directions}`); //רשימת כיוונים אפשריים
   // const choosedDirection = checkChoosedDirection(host.selectedShip.x, host.selectedShip.y, host.selectedShip.shipSize, { x, y });
   // const legitOption = directions.findIndex((direction) => direction === choosedDirection);
   // if (legitOption !== -1) {
    const shipToPlace = suggesmentOption(directions, x, y, host.selectedShip.shipSize);
      shipToPlace.forEach((cell) => {
    //    if (action === "mouseOver") {
        //host.table[cell.x][cell.y].className += " hover-ship";
     //   }else{if (action === "mouselLeave") {
     //     host.table[cell.x][cell.y].className = host.table[cell.x][cell.y].className.replace(" hover-ship", "");
     //   }
    //  }
      dispatch({
        type: action,
        payload: {
          x: cell.x,
          y: cell.y,
        },
      });
      });
    //}
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
            <span
              id="ship-4-1"
              className="wholeShip ship-4-1"
              onClick={() => selectShipHandler("ship-4-1", 4, 1)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-3-1"
              className="wholeShip ship-3-1"
              onClick={() => selectShipHandler("ship-3-1", 3, 1)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-3-2"
              className="wholeShip ship-3-2"
              onClick={() => selectShipHandler("ship-3-2", 3, 2)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-2-1"
              className="wholeShip ship-2-1"
              onClick={() => selectShipHandler("ship-2-1", 2, 1)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-2-2"
              className="wholeShip ship-2-2"
              onClick={() => selectShipHandler("ship-2-2", 2, 2)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-2-3"
              className="wholeShip ship-2-3"
              onClick={() => selectShipHandler("ship-2-3", 2, 3)}
            >
              <div className="ship-part"></div>
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-1-1"
              className="wholeShip ship-1-1"
              onClick={() => selectShipHandler("ship-1-1", 1, 1)}
            >
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-1-2"
              className="wholeShip ship-1-2"
              onClick={() => selectShipHandler("ship-1-2", 1, 2)}
            >
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-1-3"
              className="wholeShip ship-1-3"
              onClick={() => selectShipHandler("ship-1-3", 1, 3)}
            >
              <div className="ship-part"></div>
            </span>
            <span
              id="ship-1-4"
              className="wholeShip ship-1-4"
              onClick={() => selectShipHandler("ship-1-4", 1, 4)}
            >
              <div className="ship-part"></div>
            </span>
          </div>
          {/* !!!!!!! GAME !!!!!!!! */}
          <div className="game-grid">
            {host.table.map((row, x) => (
              <div className="row" key={x}>
                {row.map((cell, y) => (
                  <div
                    className={cell.className}
                    key={y}
                    onClick={() => handleClick(x, y)}
                    onMouseOver={() => mouseHandler("MOUSE_OVER",x, y)}
                    onMouseLeave={() => mouseHandler("MOUSE_LEAVE", x, y)}
                  >
                    {cell?.axe}
                    {/* {cell?.shipID && cell.shipID} */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
