import Piece from "./Piece";
import King from "./King";

//TODO promotion
class Pawn extends Piece {
  constructor(colour, board, counter = 0, doublestep = null) {
    super("p", colour, board);
    this.doublestep = doublestep;
    this.counter = counter;
  }

  clone(board) {
    return new Pawn(this.colour, board, this.counter, this.doublestep);
  }
  //new moves: double promote inPassing

  //TODO
  naiveMoveType(to) {
    let from = this.getPos();

    //if white
    if (this.colour) {
      if (
        !(from[0] - 1 == to[0] && from[1] == to[1]) &&
        !(from[0] - 2 == to[0] && from[1] == to[1]) &&
        !(from[0] - 1 == to[0] && from[1] + 1 == to[1]) &&
        !(from[0] - 1 == to[0] && from[1] - 1 == to[1])
      ) {
        return "l";
      }

      //single step
      if (from[0] - 1 == to[0] && from[1] == to[1]) {
        if (this.board.getPiece(to) != null) {
          return "l";
        }
      }

      //double step
      if (from[0] - 2 == to[0] && from[1] == to[1]) {
        if (this.counter != 0) {
          return "l";
        }
        if (this.board.getPiece(to) != null) {
          return "l";
        }
        return "double";
      }

      //diagonal step
      if (
        (from[0] - 1 == to[0] && from[1] + 1 == to[1]) ||
        (from[0] - 1 == to[0] && from[1] - 1 == to[1])
      ) {
        if (
          this.board.getPiece(to) != null &&
          this.board.getPiece(to).colour == this.colour
        ) {
          return "o";
        }
        if (
          this.board.getPiece(to) != null &&
          this.board.getPiece(to).colour != this.colour
        ) {
          return "c";
        }
        //in passing
        if (this.board.getPiece(to) == null) {
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              let piece = this.board.getPiece([i, j]);
              if (piece instanceof Pawn && piece.colour != this.colour) {
                if (piece.doublestep != null && piece.getPos()[1] == to[1]) {
                  return "inPassing";
                }
              }
            }
          }
          return "l";
        }
      }

      return "m";
    }

    //if black
    else {
      if (
        !(from[0] + 1 == to[0] && from[1] == to[1]) &&
        !(from[0] + 2 == to[0] && from[1] == to[1]) &&
        !(from[0] + 1 == to[0] && from[1] + 1 == to[1]) &&
        !(from[0] + 1 == to[0] && from[1] - 1 == to[1])
      ) {
        return "l";
      }

      //single step
      if (from[0] + 1 == to[0] && from[1] == to[1]) {
        if (this.board.getPiece(to) != null) {
          return "l";
        }
      }

      //double step
      if (from[0] + 2 == to[0] && from[1] == to[1]) {
        if (this.counter != 0) {
          return "l";
        }
        if (this.board.getPiece(to) != null) {
          return "l";
        }
        return "double";
      }

      //diagonal step
      if (
        (from[0] + 1 == to[0] && from[1] + 1 == to[1]) ||
        (from[0] + 1 == to[0] && from[1] - 1 == to[1])
      ) {
        if (
          this.board.getPiece(to) != null &&
          this.board.getPiece(to).colour == this.colour
        ) {
          return "o";
        }
        if (
          this.board.getPiece(to) != null &&
          this.board.getPiece(to).colour != this.colour
        ) {
          return "c";
        }
        //inPassing
        if (this.board.getPiece(to) == null) {
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              let piece = this.board.getPiece([i, j]);
              if (piece instanceof Pawn && piece.colour != this.colour) {
                if (piece.doublestep != null && piece.getPos()[1] == to[1]) {
                  return "inPassing";
                }
              }
            }
          }
          return "l";
        }
      }

      return "m";
    }
  }

  //TODO
  moveType(to) {
    if (this.board.getPiece(to) instanceof King) {
      return "k";
    }

    if (this.naiveMoveType(to) != "l" && this.naiveMoveType(to) != "o") {
      let copy = this.board.copy();
      let self = copy.getPiece(this.getPos());

      if (this.naiveMoveType(to) == "m") {
        self.moveToEmpty(to);
      } else if (this.naiveMoveType(to) == "c") {
        self.capture(to);
      } else if (this.naiveMoveType(to) == "double") {
        self.moveToEmpty(to);
      } else if (this.naiveMoveType(to) == "inPassing") {
        //white
        if (self.colour) {
          if (copy.moves != copy.getPiece([to[0] + 1, to[1]]).doublestep) {
            return "l";
          }
        }
        //black
        else {
          if (copy.moves != copy.getPiece([to[0] - 1, to[1]]).doublestep) {
            return "l";
          }
        }

        self.moveToEmpty(to);

        if (self.colour) {
          copy.board[to[0]][to[1] + 1].pop();
        } else {
          copy.board[to[0]][to[1] - 1].pop();
        }
      }

      if (copy.checked(this.colour)) {
        return "check";
      }
    }
    return this.naiveMoveType(to);
  }

  move(to) {
    let moveType = this.moveType(to);

    if (moveType == "double") {
      console.log("double stepped");
      this.moveToEmpty(to);
      this.counter += 1;
      this.board.moves += 1;
      this.doublestep = this.board.moves;
      return true;
    }
    if (moveType == "inPassing") {
      console.log("in passing");
      this.moveToEmpty(to);
      this.counter += 1;

      if (this.colour) {
        this.board.captured.push(this.board.board[to[0] + 1][to[1]].pop());
      } else {
        this.board.captured.push(this.board.board[to[0] - 1][to[1]].pop());
      }
      this.board.moves += 1;
      return true;
    }

    if (moveType == "l") {
      console.log("piece movement logic error");
      return false;
    }

    if (moveType == "o") {
      console.log("trying to move into occupied square");
      return false;
    }

    if (moveType == "k") {
      console.log("you can not take the king");
      return false;
    }

    if (moveType == "check") {
      console.log("this move puts king in check");
      return false;
    }

    if (moveType == "m") {
      this.moveToEmpty(to);
      console.log("moved to empty spot");
      this.counter += 1;
      this.board.moves += 1;
      return true;
    }
    if (moveType == "c") {
      this.capture(to);
      this.counter += 1;
      console.log("captured");
      this.board.moves += 1;
      return true;
    }

    //crazy bug is this happens
    console.log("this should never happen");
    return false;
  }
}

export default Pawn;
