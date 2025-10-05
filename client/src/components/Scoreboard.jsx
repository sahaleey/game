function Scoreboard({ score }) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-6 py-2 rounded-full">
      <div className="text-2xl font-bold text-center">{score}</div>
    </div>
  );
}

export default Scoreboard;
