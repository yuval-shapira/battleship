import {
  optionalDirections,
  checkChoosedDirection,
  cellsToMark,
  disableCellsAroundShip,
  // suggesmentOption,
  checkIfNeedToBeDisable,
  toRemoveTag,
} from "../utils/PlaceShips.js";

export default function gameBuilderReducer(state, { type, payload }) {
  switch (type) {
    case "ENTER_NAME":
      const nameState = { ...state };
      nameState.player1 = payload.player1;
      return nameState;
    
    case "SELECT_SHIP":
      const selectedState = { ...state };

      const shipInLegend = selectedState.legend.findIndex(
        (ship) => ship.shipID === payload.shipID
      );

      if (selectedState.legend[shipInLegend]?.shipLocation.length !== 0) {
        return state;
      }
      const selectShipX = selectedState.selectedShip.x;
      const selectShipY = selectedState.selectedShip.y;
      if (selectedState.selectedShip.x !== null) {
        selectedState.table[selectShipX][selectShipY].className = "";
        selectedState.table[selectShipX][selectShipY].cellStatus = "";
        selectedState.table[selectShipX][selectShipY].disable = false;
        selectedState.table[selectShipX][selectShipY].shipID = null;
        selectedState.table[selectShipX][selectShipY].removeShip = false;

        selectedState.table.forEach((row) => {
          row.forEach((cell) => {
            if (!cell?.axe) {
              //console.log("cell: ", cell);
              cell.shipID
                ? (cell.cellStatus = "placed-ship")
                : (cell.cellStatus = "");
            }
          });
        });
      }
      selectedState.selectedShip.shipID = payload.shipID;
      selectedState.selectedShip.indexInLegend = shipInLegend;
      selectedState.selectedShip.shipSize = payload.shipSize;
      selectedState.selectedShip.shipNum = payload.shipNum;
      selectedState.selectedShip.x = null;
      selectedState.selectedShip.y = null;

      selectedState.firstPlaced = false;

      return selectedState;

    case "REMOVE_SHIP":
      //   console.log(payload);
      const removeShipState = { ...state };
      const shipInLegendRemove = removeShipState.legend.findIndex(
        (ship) => ship.shipID === payload.shipID
      );
      const shipToRemove = removeShipState.legend[shipInLegendRemove].shipLocation;
      shipToRemove.forEach((partLocation) => {
        removeShipState.table[partLocation.x][partLocation.y].className = "";
        removeShipState.table[partLocation.x][partLocation.y].cellStatus = "";
        removeShipState.table[partLocation.x][partLocation.y].disable = false;
        removeShipState.table[partLocation.x][partLocation.y].shipID = null;
        removeShipState.table[partLocation.x][
          partLocation.y
        ].removeShip = false;
      });
      const removeShipX = removeShipState.selectedShip.x;
      const removeShipY = removeShipState.selectedShip.y;
      if (removeShipState.selectedShip.x !== null) {
        removeShipState.table[removeShipX][removeShipY].className = "";
        removeShipState.table[removeShipX][removeShipY].cellStatus = "";
        removeShipState.table[removeShipX][removeShipY].disable = false;
        removeShipState.table[removeShipX][removeShipY].shipID = null;
        removeShipState.table[removeShipX][removeShipY].removeShip = false;
      }
      removeShipState.table.forEach((row, x) => {
        row.forEach((cell, y) => {
          const stayDisabled = checkIfNeedToBeDisable(
            x,
            y,
            removeShipState.table
          );
          if (!stayDisabled) {
            removeShipState.table[x][y].disable = false;
          }
          if (!cell?.axe) {
            //console.log("cell: ", cell);
            cell.shipID
              ? (cell.cellStatus = "placed-ship")
              : (cell.cellStatus = "");
          }
        });
      });
      removeShipState.numOfShipsPlaced -= 1;
      removeShipState.legend[shipInLegendRemove].isPlaced = null;
      removeShipState.legend[shipInLegendRemove].shipLocation = [];

      return removeShipState;

    case "FIRST_PLACED":
      const firstState = { ...state };
      if (firstState.selectedShip.shipID === null) {
        return state;
      }

      const selectedCell = firstState.table[payload.x][payload.y];
      if (selectedCell.disable === false) {
        selectedCell.shipID = firstState.selectedShip.shipID;
        selectedCell.cellStatus = "placed-ship";

        if (firstState.selectedShip.shipSize !== 1) {
          firstState.selectedShip.x = payload.x;
          firstState.selectedShip.y = payload.y;
          firstState.firstPlaced = true;
        } else {
          selectedCell.disable = true;

          //firstState.legend[firstState.selectedShip.indexInLegend].shipLocation = [{x: payload.x, y: payload.y}];

          const shipInLegend = firstState.legend.findIndex(
            (ship) => ship.shipID === firstState.selectedShip.shipID
          );
          //firstState.legend[shipInLegend].isPlaced = true;
          firstState.legend[shipInLegend].cellStatus = "placed";
          firstState.legend[shipInLegend].shipLocation = [
            { x: payload.x, y: payload.y },
          ];

          const disableAround = disableCellsAroundShip([
            { x: payload.x, y: payload.y },
          ]);
          disableAround.forEach((cell) => {
            firstState.table[cell.x][cell.y].disable = true;
          });

          firstState.numOfShipsPlaced++;

          firstState.table[payload.x][payload.y].removeShip = true;

          firstState.selectedShip.shipID = null;
          firstState.selectedShip.shipSize = null;
          firstState.selectedShip.shipNum = null;
          firstState.selectedShip.shipLocation = null;
          firstState.selectedShip.indexInLegend = null;
        }
      }
      return firstState;

    case "FULL_PLACED":
      const fullState = { ...state };
      if (fullState.selectedShip.shipID === null) {
        return state;
      }

      const directions = optionalDirections(
        fullState.table,
        fullState.selectedShip.x,
        fullState.selectedShip.y,
        fullState.selectedShip
      );
      if (directions.length !== 0) {
        const choosedDirection = checkChoosedDirection(
          fullState.selectedShip.x,
          fullState.selectedShip.y,
          fullState.selectedShip.shipSize,
          payload
        );
        const legitOption = directions.findIndex(
          (direction) => direction === choosedDirection
        );
        if (legitOption !== -1) {
          fullState.table.forEach((row) => {
            row.forEach((cell) => {
              if (!cell.shipID && cell.cellStatus !== "axe")
                cell.cellStatus = "";
            });
          });

          const shipToPlace = cellsToMark(
            choosedDirection,
            fullState.selectedShip.x,
            fullState.selectedShip.y,
            fullState.selectedShip.shipSize
          );
          shipToPlace.forEach((cell) => {
            fullState.table[cell.x][cell.y].shipID = state.selectedShip.shipID;
            fullState.table[cell.x][cell.y].cellStatus = "placed-ship";
          });
          //save ship coordinates in legend
          fullState.legend[fullState.selectedShip.indexInLegend].shipLocation = shipToPlace;

          const toRemove = toRemoveTag(
            choosedDirection,
            fullState.selectedShip.x,
            fullState.selectedShip.y,
            fullState.selectedShip.shipSize
          );
          fullState.table[toRemove.x][toRemove.y].removeShip = true;
          const disableAround = disableCellsAroundShip(shipToPlace);
          disableAround.forEach((cell) => {
            fullState.table[cell.x][cell.y].disable = true;
          });
          fullState.numOfShipsPlaced++;

          fullState.selectedShip.shipID = null;
          fullState.selectedShip.shipSize = null;
          fullState.selectedShip.shipNum = null;
          fullState.selectedShip.x = null;
          fullState.selectedShip.y = null;
          fullState.selectedShip.shipLocation = null;
          fullState.selectedShip.indexInLegend = null;

          fullState.firstPlaced = false;

        }
      }
      
      return fullState;

    case "MOUSE_OVER":
      const mouseOverState = { ...state };
      const cell = mouseOverState.table[payload.x][payload.y];
      if (!mouseOverState.firstPlaced)
        if (!cell?.axe) cell.cellStatus = "hover-ship";
      return mouseOverState;

    case "MOUSE_LEAVE":
      const mouseLeaveState = { ...state };
      if (!mouseLeaveState.firstPlaced)
        mouseLeaveState.table.forEach((row) => {
          row.forEach((cell) => {
            if (!cell?.axe) {
              cell.shipID
                ? (cell.cellStatus = "placed-ship")
                : (cell.cellStatus = "");
            }
            //cell.className = cell.className.replace(" hover-ship", "");
          });
        });
      return mouseLeaveState;

    case "START_GAME":
      console.log("start game");
      
      const startGameState = { ...state };
      startGameState.gameStarted = true;
      startGameState.table.forEach((row) => {
        row.forEach((cell) => {
          if(cell.removeShip) 
            cell.removeShip = false;
        });
      });
      return startGameState;

      default:
      return state;
  }
}
