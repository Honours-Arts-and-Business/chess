import Piece from "./Piece";
import King from "./King";

class Pawn extends Piece {
  constructor(colour, board, counter = 0, doublestep = false) {
    super("p", colour, board);
    this.counter = counter;
    this.doublestep = doublestep;
    this.inPassing = null;
  }

  clone() {
    return new Pawn(this.colour, this.board, this.counter, this.doublestep);
  }

  naiveMoveType(to) {
    let from = this.getPos();

    //if white
    if (this.colour) {
      console.log(from == [from[0], from[1]]);
      if (
        [from[0] + 1, from[1]] != to &&
        [from[0] + 1, from[1] + 1] != to &&
        [from[0] + 1, from[1] - 1] != to &&
        [from[0] + 2, from[1]] != to
      ) {
        return "l";
      }

      //single step
      if ([from[0] + 1, from[1]] == to) {
        if (this.board.getPiece(to) != null) {
          return "o";
        }
        if (to[0] == 0) {
          return "promote";
        }
      }

      //diagonal step
      if (
        [from[0] + 1, from[1] + 1] == to ||
        [from[0] + 1, from[1] - 1] == to
      ) {
        //in passing
        {
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 9; j++) {
              if (this.board.board[i][j].getPiece() instanceof Pawn) {
                let pawn = this.board.board[i][j].getPiece();
                if (pawn.inPassing == to && pawn.counter == 1) {
                  return "c";
                }
              }
            }
          }
        }

        if (
          this.board.getPiece(to) == null ||
          this.board.getPiece(to).colour == this.colour
        ) {
          return "l";
        }

        return "c";
      }

      //double step
      if ([from[0] + 2, from[1]] == to) {
        if (this.counter != 0) {
          return "l";
        }
        if (this.board.getPiece(to) != null) {
          return "l";
        } else {
          return "double";
        }
      }

      return "m";
    }
    //if black
    else {
      if (
        [from[0] - 1, from[1]] != to &&
        [from[0] - 1, from[1] + 1] != to &&
        [from[0] - 1, from[1] - 1] != to &&
        [from[0] - 2, from[1]] != to
      ) {
        return "l";
      }

      //single step
      if ([from[0] - 1, from[1]] == to) {
        if (this.board.getPiece(to) != null) {
          return "o";
        }
        if (to[0] == 0) {
          return "promote";
        }
      }

      //diagonal step
      if (
        [from[0] - 1, from[1] + 1] == to ||
        [from[0] - 1, from[1] - 1] == to
      ) {
        //in passing
        {
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 9; j++) {
              if (this.board.board[i][j].getPiece() instanceof Pawn) {
                let pawn = this.board.board[i][j].getPiece();
                if (pawn.inPassing == to && pawn.counter == 1) {
                  return "c";
                }
              }
            }
          }
        }

        if (
          this.board.getPiece(to) == null ||
          this.board.getPiece(to).colour == this.colour
        ) {
          return "l";
        }

        return "c";
      }

      //double step
      if ([from[0] - 2, from[1]] == to) {
        if (this.board.getPiece(to) != null) {
          return "l";
        }
      }

      return "m";
    }
  }

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
      } else if (this.naiveMoveType(to) == "promote") {
        self.moveToEmpty(to);
      }

      if (copy.checked(this.colour)) {
        return "check";
      }
    }
    return this.naiveMoveType(to);
  }

  move(to) {
    let moveType = this.moveType(to);

    if (moveType == "promote") {
      console.log("WIP");
      return true;
    }
    if (moveType == "double") {
      console.log("double stepped");
      if (this.colour) {
        this.inPassing = [this.getPos()[0] + 1, this.getPos()[1]];
      } else {
        this.inPassing = [this.getPos()[0] - 1, this.getPos()[1]];
      }
      this.moveToEmpty(to);
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
      this.moved = true;
      return true;
    }
    if (moveType == "c") {
      this.capture(to);
      this.moved = true;
      console.log("captured");
      return true;
    }

    //crazy bug is this happens
    console.log("this should never happen");
    return false;
  }
}

export default Pawn;
