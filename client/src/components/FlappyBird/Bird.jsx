function Bird({ x, y, size, color, velocity }) {
  const rotation = Math.min(Math.max(velocity * 2, -30), 30);

  const getBirdColor = (color) => {
    const colors = {
      yellow: "bg-yellow-400",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-400",
      purple: "bg-purple-500",
    };
    return colors[color] || "bg-yellow-400";
  };

  return (
    <div
      className={`absolute ${getBirdColor(
        color
      )} rounded-full border-2 border-black`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.1s",
      }}
    >
      {/* Eye */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full border border-black">
        <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
      </div>

      {/* Beak */}
      <div className="absolute top-1/2 right-2 w-4 h-2 bg-orange-500 border border-black"></div>

      {/* Wing */}
      <div
        className="absolute bottom-2 left-2 w-6 h-3 bg-black/20 rounded-full"
        style={{
          transform: `scale(${1 - Math.max(velocity * 0.01, 0)})`,
        }}
      ></div>
    </div>
  );
}

export default Bird;
