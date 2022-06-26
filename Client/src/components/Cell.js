import React from "react";

export default function Cell({cell, x, y, handleClick, mouseHandler, removeShipHanler}) {
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
      {cell?.removeShip && (
        <div
          className="remove-ship"
          onClick={
            cell.axe
              ? null
              : () => removeShipHanler(cell.shipID, x, y)
          }
        >
          X
        </div>
      )}
    </div>
  );
}
