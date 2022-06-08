//return an array of directions that the ship can be placed in
export function optionalDirections(table, x, y, shipSize) {
    const directions = [];    
    if (y + shipSize <= 11){
      const downDirection = checkForDisabledCells("down", x, y, shipSize, table)
      downDirection && directions.push("down");
    }
    if (y - shipSize >= 0){
      const upDirection = checkForDisabledCells("up", x, y, shipSize, table)
      upDirection && directions.push("up");
    }
    if (x + shipSize <= 11){
      const rightDirection = checkForDisabledCells("right", x, y, shipSize, table)
      rightDirection && directions.push("right");
    }
    if (x - shipSize >=  0){
      const leftDirection = checkForDisabledCells("left", x, y, shipSize, table)
      leftDirection && directions.push("left");
    }
    return directions;
}
//return the direction that the ship should be placed in
export function checkChoosedDirection(x, y, shipSize, userOption){
let choosedDirection = "";
if (userOption.x === x && userOption.y !== y) {
  if (userOption.y > y && y + shipSize <= 11) {
    choosedDirection = "down";
  } else {
    if (userOption.y < y && y - shipSize >= 0) {
      choosedDirection = "up";
    }
  }
} else {
  if (userOption.x !== x && userOption.y === y) {
    if (userOption.x > x && x + shipSize <= 11) {
      choosedDirection = "right";
    } else {
      if (userOption.x < x && x - shipSize >= 0) {
        choosedDirection = "left";
      }
    }
  }
}
return choosedDirection;
}

export function suggesmentOption(directions, x, y, shipSize) {
  let options = [];
  directions.forEach((direction) => {
    options = options.concat(cellsToMark(direction, x, y, shipSize));
});
  console.log(options);
  return options;
}
//return an array of cells that the ship should be placed in
export function cellsToMark(direction, x, y, shipSize) {
const cellsToMark = [];
switch (direction) {
  case "down":
    for (let i = y; i < y + shipSize; i++) {
      cellsToMark.push({ x, y: i });
    }
    break;
  case "up":
    for (let i = y; i > y - shipSize; i--) {
      cellsToMark.push({ x, y: i });
    }
    break;
  case "right":
    for (let i = x; i < x + shipSize; i++) {
      cellsToMark.push({ x: i, y });
    }
    console.log(cellsToMark);
    break;
  case "left":
    for (let i = x; i > x - shipSize; i--) {
      cellsToMark.push({ x: i, y });
    }
    break;
  default:
    break;
}
return cellsToMark;
}
//return an array of cells around the ship that should be marked as "disabled" for the user to place a ship in
export function disableCellsAroundShip(ship){
const disableAroundShip = [];
ship.forEach((cell) => {
  if (cell.x - 1 > 0) {
    disableAroundShip.push({ x: cell.x - 1, y: cell.y });
  }
  if (cell.x + 1 < 11) {
    disableAroundShip.push({ x: cell.x + 1, y: cell.y });
  }
  if (cell.y - 1 > 0) {
    disableAroundShip.push({ x: cell.x, y: cell.y - 1 });
  }
  if (cell.y + 1 < 11) {
    disableAroundShip.push({ x: cell.x, y: cell.y + 1 });
  }
  if (cell.x - 1 > 0 && cell.y - 1 > 0) {
    disableAroundShip.push({ x: cell.x - 1, y: cell.y - 1 });
  }
  if (cell.x - 1 > 0 && cell.y + 1 < 11) {
    disableAroundShip.push({ x: cell.x - 1, y: cell.y + 1 });
  }
  if (cell.x + 1 < 11 && cell.y - 1 > 0) {
    disableAroundShip.push({ x: cell.x + 1, y: cell.y - 1 });
  }
  if (cell.x + 1 < 11 && cell.y + 1 < 11) {
    disableAroundShip.push({ x: cell.x + 1, y: cell.y + 1 });
  }
}
);
return disableAroundShip;
}
function checkForDisabledCells(direction, x, y, shipSize, table) {
  switch (direction) {
    case "down":
      for (let i = y; i < y + shipSize; i++) {
        if (table[x][i]?.disable === true) {
          return false;
        }
      }
      break;
    case "up":
      for (let i = y; i > y - shipSize; i--) {
        if (table[x][i]?.disable === true) {
          return false;
        }
      }
      break;
    case "right":
      for (let i = x; i < x + shipSize; i++) {
        if (table[i][y]?.disable === true) {
          return false;
        }
      }
      break;
    case "left":
      for (let i = x; i > x - shipSize; i--) {
        if (table[i][y]?.disable === true) {
          return false;
        }
      }
      break;
    default:
      break;
  }
  return true;
}