import King from "./King";

class Piece {
  constructor(symbol, colour, board) {
    this.symbol = symbol;
    this.colour = colour;
    this.board = board;
  }
  toString() {
    return this.symbol;
  }

  clone() {}

  naiveCanAttack(pos) {
    return this.naiveMoveType(pos) == "m" || this.naiveMoveType(pos) == "c";
  }

  naiveMoveType() {}

  //king & pawn need to override this
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
      }

      if (copy.checked(this.colour)) {
        return "check";
      }
    }
    return this.naiveMoveType(to);
  }

  //king & pawn need to override this
  move(to) {
    let moveType = this.moveType(to);

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
      this.board.moves += 1;
      return true;
    }
    if (moveType == "c") {
      this.capture(to);
      this.moved = true;
      console.log("captured");
      this.board.moves += 1;

      return true;
    }

    //crazy bug is this happens
    console.log("this should never happen");
    return false;
  }

  validMove(to) {
    if (this.moveType(to) == "l") {
      return false;
    }
    if (this.moveType(to) == "o") {
      return false;
    }
    if (this.moveType(to) == "check") {
      return false;
    }
    if (this.moveType(to) == "k") {
      return false;
    }
    return true;
  }

  //should be overriden. Works but inefficient since it checks squares that pieces would never be
  validMoveList() {
    let r = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.validMove([i, j])) {
          r.push([i, j]);
        }
      }
    }
    return r;
  }

  getPos() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board.board[i][j].includes(this)) {
          return [i, j];
        }
      }
    }
    return null;
  }

  moveToEmpty(to) {
    let from = this.getPos();
    this.board.board[to[0]][to[1]].push(
      this.board.board[from[0]][from[1]].pop()
    );
  }

  capture(to) {
    this.board.captured.push(this.board.board[to[0]][to[1]].pop());
    this.moveToEmpty(to);
  }
}

export default Piece;
