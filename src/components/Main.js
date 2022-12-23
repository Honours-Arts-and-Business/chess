import React, { useState, useEffect } from "react";
import Board from "../entities/Board";
import Game from "../entities/Game";
import BoardComponent from "./BoardComponent";

const Main = () => {
  const [game, setGame] = useState(new Game());

  const test = () => {
    console.log(game.b);
  };

  const move = (from, to) => {
    let moved = game.b.move(from, to);
    setGame(new Game(game.b));
    return moved;
  };

  return (
    <div>
      <BoardComponent
        b={game.b}
        board={game.b.simpleCopy()}
        move={move}
      ></BoardComponent>
      <button onClick={test}>test</button>
    </div>
  );
};

export default Main;
