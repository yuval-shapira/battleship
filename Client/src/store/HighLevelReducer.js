import React from "react";

export default function highLevelReducer(state, { type, payload }) {
  switch (type) {
    case "ENTER_NAME":
      const nameState = { ...state };
      nameState.myName = payload.player1;
      nameState.gameState = "PLACE_SHIPS";
      return nameState;
    case "PLACE_SHIPS":
        const cloneHostTable = [];
        for (let i = 0; i < 11; i++) {
            cloneHostTable.push([]);
          for (let j = 0; j < 11; j++) {
            cloneHostTable[i].push({
                ...state.hostTable[i][j],
            });
          }
        }
      const placeState = { ...state };
        placeState.table = [...cloneHostTable];
        nameState.gameState = "GAME_STARTED";
        return placeState;
    default:
      return state;
  }
}
