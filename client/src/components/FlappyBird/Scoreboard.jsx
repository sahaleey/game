import React from "react";

function Scoreboard({ score }) {
  return (
    <div className="absolute top-0 left-0 right-0 pt-8 text-center z-10">
      <p
        className="text-5xl font-bold text-white"
        style={{ WebkitTextStroke: "2px black" }}
      >
        {score}
      </p>
    </div>
  );
}

export default Scoreboard;
