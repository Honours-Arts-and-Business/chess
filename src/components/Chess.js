import React, { useState, useEffect } from "react";
import Game from "../entities/Game";
import Board from "./Board";
import Test from "./Test";

const Main = () => {
  const [game, setGame] = useState(new Game());

  const move = (from, to) => {
    let moved = game.move(from, to);
    setGame(new Game(game));
    return moved;
  };

  return (
    <div>
      <Board game={game} move={move}></Board>
      <Test game={game}></Test>
    </div>
  );
};

export default Main;
