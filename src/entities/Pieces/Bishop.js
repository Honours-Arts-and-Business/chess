import Piece from "./Piece";

class Bishop extends Piece {
  constructor(color, game) {
    super("b", color, game);
  }

  clone(game) {
    return new Bishop(this.colour, game);
  }

  naiveMoveType(to) {
    let from = this.getPos();

    //innate piece logic
    {
      if (Math.abs(from[0] - to[0]) != Math.abs(from[1] - to[1])) {
        return "l";
      }

      //moving down right
      if (from[0] < to[0] && from[1] < to[1]) {
        for (let i = 1; i < Math.abs(from[0] - to[0]); i++) {
          if (this.game.getPiece([from[0] + i, from[1] + i]) != null) {
            return "l";
          }
        }
      }
      //moving down left
      if (from[0] < to[0] && from[1] > to[1]) {
        for (let i = 1; i < Math.abs(from[0] - to[0]); i++) {
          if (this.game.getPiece([from[0] + i, from[1] - i]) != null) {
            return "l";
          }
        }
      }
      //moving up right
      if (from[0] > to[0] && from[1] < to[1]) {
        for (let i = 1; i < Math.abs(from[0] - to[0]); i++) {
          if (this.game.getPiece([from[0] - i, from[1] + i]) != null) {
            return "l";
          }
        }
      }
      //moving up left
      if (from[0] > to[0] && from[1] > to[1]) {
        for (let i = 1; i < Math.abs(from[0] - to[0]); i++) {
          if (this.game.getPiece([from[0] - i, from[1] - i]) != null) {
            return "l";
          }
        }
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

export default Bishop;
