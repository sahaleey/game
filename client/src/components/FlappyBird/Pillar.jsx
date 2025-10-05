import React from "react";

function Pillar({ x, gapPosition, gapHeight, width, gameHeight }) {
  const bottomPillarHeight = gameHeight - (gapPosition + gapHeight);

  return (
    <>
      {/* Top Pillar */}
      <div
        className="absolute bg-green-500 border-2 border-green-700"
        style={{
          left: x,
          top: 0,
          width: width,
          height: gapPosition,
        }}
      />
      {/* Bottom Pillar */}
      <div
        className="absolute bg-green-500 border-2 border-green-700"
        style={{
          left: x,
          top: gapPosition + gapHeight,
          width: width,
          height: bottomPillarHeight,
        }}
      />
    </>
  );
}

export default Pillar;
