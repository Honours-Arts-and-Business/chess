import Piece from "./Piece";

class Queen extends Piece {
  constructor(color, game) {
    super("q", color, game);
  }

  clone(game) {
    return new Queen(this.colour, game);
  }

  naiveMoveType(to) {
    let from = this.getPos();

    //innate logic
    {
      if (
        from[0] != to[0] &&
        from[1] != to[1] &&
        Math.abs(from[0] - to[0]) != Math.abs(from[1] - to[1])
      ) {
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

      //no obstructions in between self and to
      if (from[0] == to[0]) {
        for (
          let i = Math.min(from[1], to[1]) + 1;
          i < Math.max(from[1], to[1]);
          i++
        ) {
          if (this.game.getPiece([from[0], i]) != null) {
            return "l";
          }
        }
      }

      //no obstructions in between self and to
      if (from[1] == to[1]) {
        for (
          let i = Math.min(from[0], to[0]) + 1;
          i < Math.max(from[0], to[0]);
          i++
        ) {
          if (this.game.getPiece([i, from[1]]) != null) {
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

export default Queen;
