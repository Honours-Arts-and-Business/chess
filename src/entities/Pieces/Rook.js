import Piece from "./Piece";
import King from "./King";

class Rook extends Piece {
  constructor(colour, board, moved = false) {
    super("r", colour, board);
    this.moved = moved;
  }

  clone(board) {
    return new Rook(this.colour, board, this.moved);
  }

  naiveMoveType(to) {
    let from = this.getPos();

    //innate logic
    {
      //on same row or on same col
      if (from[0] != to[0] && from[1] != to[1]) {
        return "l";
      }

      //no obstructions in between self and to
      if (from[0] == to[0]) {
        for (
          let i = Math.min(from[1], to[1]) + 1;
          i < Math.max(from[1], to[1]);
          i++
        ) {
          if (this.board.getPiece([from[0], i]) != null) {
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
          if (this.board.getPiece([i, from[1]]) != null) {
            return "l";
          }
        }
      }
    }

    //occupied logic
    {
      if (this.board.getPiece(to) != null) {
        //the position is occupied by ally
        if (this.board.getPiece(to).colour == this.colour) {
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

export default Rook;
