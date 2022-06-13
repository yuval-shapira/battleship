import React from "react";

export default function Cell({cell, x, y, handleClick,mouseHandler}) {
  const className = cell.cellStatus;
  return (
    <div
      className={cell.axe ? className : `cell ${className}`}
      key={y}
      onClick={cell.axe ? null : () => handleClick(x, y)}
      onMouseLeave={cell.axe ? null : () => mouseHandler("MOUSE_LEAVE", x, y)}
      onMouseOver={cell.axe ? null : () => mouseHandler("MOUSE_OVER", x, y)}
    >
      {cell?.axe && cell.axe}
      {/* {cell?.toRemove && (
        <div
          className="remove-ship"
          onClick={
            cell.axe
              ? null
              : () =>
                  dispatch({
                    type: "REMOVE_SHIP",
                    payload: { shipID: cell.shipID, x, y },
                  })
          }
        >
          X
        </div>
      )} */}
    </div>
  );
}
