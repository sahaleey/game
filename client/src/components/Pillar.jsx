function Pillar({
  x,
  gapPosition,
  gapHeight,
  width,
  gameHeight,
  groundHeight,
}) {
  const topPillarHeight = gapPosition;
  const bottomPillarHeight =
    gameHeight - groundHeight - gapPosition - gapHeight;

  return (
    <>
      {/* Top Pillar */}
      <div
        className="absolute bg-green-600 border-2 border-green-800"
        style={{
          left: x,
          top: 0,
          width: width,
          height: topPillarHeight,
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-700 border-t-2 border-green-900"></div>
        <div className="absolute bottom-4 left-0 right-0 h-2 bg-green-800"></div>
      </div>

      {/* Bottom Pillar */}
      <div
        className="absolute bg-green-600 border-2 border-green-800"
        style={{
          left: x,
          bottom: groundHeight,
          width: width,
          height: bottomPillarHeight,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-green-700 border-b-2 border-green-900"></div>
        <div className="absolute top-4 left-0 right-0 h-2 bg-green-800"></div>
      </div>
    </>
  );
}

export default Pillar;
