import React from "react";
import Cell from "./Cell";

export default function GameBoard({table, handleClick, mouseHandler, removeShipHanler}) {
    return (
        <div className="game-grid">
        {table.map((row, x) => (
          <div className="row" key={x}>
            {row.map((cell, y) => (
              <Cell
                key={`${x}${y}`}
                cell={cell}
                x={x}
                y={y}
                handleClick={handleClick}
                mouseHandler={mouseHandler}
                removeShipHanler={removeShipHanler}
              />
            ))}
            {/* add class name logic - start with change className to status... */}
          </div>
        ))}
      </div>
    );
}

