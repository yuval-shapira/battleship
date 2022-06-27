import { v4 as uuidv4 } from "uuid";

export default function initTableGame() {
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
        removeShip: false,
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
    },
    {
      shipID: "ship-3-2",
      className: "ship-3",
      shipSize: 3,
      shipNum: 2,
    },
    {
      shipID: "ship-3-1",
      className: "ship-3",
      shipSize: 3,
      shipNum: 1,
    },
    {
      shipID: "ship-2-3",
      className: "ship-2",
      shipSize: 2,
      shipNum: 3,
    },
    {
      shipID: "ship-2-2",
      className: "ship-2",
      shipSize: 2,
      shipNum: 2,
    },
    {
      shipID: "ship-2-1",
      className: "ship-2",
      shipSize: 2,
      shipNum: 1,
    },
    {
      shipID: "ship-1-4",
      className: "ship-1",
      shipSize: 1,
      shipNum: 4,
    },
    {
      shipID: "ship-1-3",
      className: "ship-1",
      shipSize: 1,
      shipNum: 3,
    },
    {
      shipID: "ship-1-2",
      className: "ship-1",
      shipSize: 1,
      shipNum: 2,
    },
    {
      shipID: "ship-1-1",
      className: "ship-1",
      shipSize: 1,
      shipNum: 1,
    },
  ];
  legendArray.forEach((ship) => {
    ship.shipLocation = [];
    ship.isPlaced = null;
  });

  return {
    legend: legendArray,
    table: initTableGame,
    player1: null,
    player2: null,
    gameID: uuidv4(),
    selectedShip: {
      shipID: null,
      shipSize: null,
      shipNum: null,
      x: null,
      y: null,
    },
    firstPlaced: false,
    numOfShipsPlaced: 0,
    gameStarted: false,
  };
}
