import React, { useState, useEffect } from "react";
import Game from "../entities/Game";
import Board from "./Board";

const Main = () => {
  const [game, setGame] = useState(new Game());

  const move = (from, to) => {
    let moved = game.move(from, to);
    setGame(new Game(game));
    return moved;
  };

  return (
    <div>
      <Board b={game} move={move}></Board>
    </div>
  );
};

export default Main;
