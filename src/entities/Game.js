import Board from "./Board";

class Game {
  constructor(b = null) {
    if (b != null) {
      this.b = b;
    } else {
      this.b = new Board();
    }
  }
}

export default Game;
