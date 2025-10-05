import React from "react";

function Pillar({ x, gapPosition, gapHeight, width, gameHeight, name }) {
  // 1. Accept 'name' prop
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
        className="absolute bg-green-500 border-2 border-green-700 flex justify-center items-start" // 2. Added flex for positioning
        style={{
          left: x,
          top: gapPosition + gapHeight,
          width: width,
          height: bottomPillarHeight,
        }}
      >
        {/* ✨ 3. NEW: The name text is added here ✨ */}
        <div
          className="text-white font-bold text-xl select-none"
          style={{
            // This style rotates the text to be vertical
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            paddingTop: "15px", // Adds some space from the top edge
          }}
        >
          {name}
        </div>
      </div>
    </>
  );
}

export default Pillar;
