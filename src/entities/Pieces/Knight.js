import Piece from "./Piece";

class Knight extends Piece {
  constructor(colour, game) {
    super("k", colour, game);
  }

  clone(game) {
    return new Knight(this.colour, game);
  }

  naiveMoveType(to) {
    let pos = this.getPos();

    //innate piece logic
    {
      if (
        (Math.abs(pos[0] - to[0]) != 2 || Math.abs(pos[1] - to[1]) != 1) &&
        (Math.abs(pos[0] - to[0]) != 1 || Math.abs(pos[1] - to[1]) != 2)
      ) {
        return "l";
      }
    }

    //occupied logic
    {
      if (this.game.getPiece(to) != null) {
        //the position is occupied by ally
        if (this.game.getPiece(to).colour == this.colour) {
          return "o";
        }
        //the position is occupied by enemy
        else {
          return "c";
        }
        //trying to move to open position
      }
    }

    return "m";
  }
}

export default Knight;
