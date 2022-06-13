import {
  optionalDirections,
  checkChoosedDirection,
  cellsToMark,
  disableCellsAroundShip,
  // suggesmentOption,
  checkIfNeedToBeDisable,
} from "../utils/PlaceShips.js";

export default function reducer(state, { type, payload }) {
  state.table.forEach((row) => {
    row.forEach((cell) => {
      cell.toRemove = false;
    });
  });
  switch (type) {
    case "SELECT_SHIP":
      const selectedState = { ...state };

      const shipInLegend = selectedState.legend.findIndex(
        (ship) => ship.shipID === payload.shipID
      );

      if (selectedState.legend[shipInLegend]?.isPlaced !== null) {
        return state;
      }

      selectedState.selectedShip.shipID = payload.shipID;
      selectedState.selectedShip.shipSize = payload.shipSize;
      selectedState.selectedShip.shipNum = payload.shipNum;
      selectedState.selectedShip.x = null;
      selectedState.selectedShip.y = null;

      selectedState.firstPlaced = false;

      return selectedState;

    case "BUTTON_REMOVE_SHIP":
      const removeState = { ...state };

      // removeState.table.forEach((row) => {
      //   row.forEach((cell) => {
      //     cell.toRemove = false;
      //   });
      // });
      removeState.table[payload.x][payload.y].toRemove = true;
      return removeState;

    case "REMOVE_SHIP":
      console.log(payload);
      const removeShipState = { ...state };
      const shipInLegendRemove = removeShipState.legend.findIndex(
        (ship) => ship.shipID === payload.shipID
      );
      removeShipState.legend[shipInLegendRemove].isPlaced = false;
      removeShipState.legend.forEach((ship) => {
        if (ship?.shipID === payload.shipID) {
          ship.isPlaced = null;
        }
      });
      removeShipState.table.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell.shipID === payload.shipID) {
            cell.shipID = null;
            cell.disable = false;
            cell.toRemove = false;
            //cell.className = "cell";
          }
          //console.log(row);
          console.log(i, j);
          //console.log(`payload.x: ${payload.x} payload.y: ${payload.y}`); //debug
          if (!checkIfNeedToBeDisable(i, j, removeShipState.table))
            cell.disable = false;
          //console.log(cell);
        });
      });

      return removeShipState;

    case "FIRST_PLACED":
      const firstState = { ...state };
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

          const shipInLegend = firstState.legend.findIndex(
            (ship) => ship.shipID === firstState.selectedShip.shipID
          );
          firstState.legend[shipInLegend].isPlaced = true;
          firstState.legend[shipInLegend].cellStatus = "placed";

          const disableAround = disableCellsAroundShip([{x: payload.x, y: payload.y}]);
          disableAround.forEach((cell) => {
            firstState.table[cell.x][cell.y].disable = true;
          });

          firstState.selectedShip.shipID = null;
          firstState.selectedShip.shipSize = null;
          firstState.selectedShip.shipNum = null;
        }
      }
      return firstState;

    case "FULL_PLACED":
      const fullState = { ...state };
      const directions = optionalDirections(
        fullState.table,
        fullState.selectedShip.x,
        fullState.selectedShip.y,
        fullState.selectedShip,
        fullState.firstPlaced
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
          const disableAround = disableCellsAroundShip(shipToPlace);
          disableAround.forEach((cell) => {
            fullState.table[cell.x][cell.y].disable = true;
          });

          //Mark ship as placed in legend
          const shipInLegend = fullState.legend.findIndex(
            (ship) => ship.shipID === fullState.selectedShip.shipID
          );
          fullState.legend[shipInLegend].isPlaced = shipToPlace;
          //fullState.legend[shipInLegend].cellStatus = "placed";

          fullState.selectedShip.shipID = null;
          fullState.selectedShip.shipSize = null;
          fullState.selectedShip.shipNum = null;
          fullState.selectedShip.x = null;
          fullState.selectedShip.y = null;

          fullState.firstPlaced = false;

          // fullState.table.forEach((row) => {
          //   row.forEach((cell) => {
          //     cell.className = cell.className.replace(" hover-ship", "");
          //   });
          //});
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

    default:
      return state;
  }
}
