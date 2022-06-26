import React from "react";

export default function LegendBoard({legendTable, selectShipHandler}) {
  return (
    <div className="legend">
      {legendTable.map((ship) => {
        const className = ship.shipLocation.length > 0
          ? `${ship.className} placed`
          : ship.className;
        return (
          <span
          key={ship.shipID}  
          id={ship.shipID}
            className={className}
            onClick={() =>
              selectShipHandler(ship.shipID, ship.shipSize, ship.shipNum)
            }
          />
        );
      })}
    </div>
  );
}
