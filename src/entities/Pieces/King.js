import Piece from "./Piece";
import Rook from "./Rook";

//NEEDS CASTLING LOGIC
class King extends Piece {
  constructor(colour, game) {
    super("K", colour, game);
    this.moved = false;
  }

  clone(game) {
    return new King(this.colour, game);
  }

  naiveCastleLogic(to) {
    if (this.game.getPiece(to) == null) {
      return false;
    }
    let piece = this.game.getPiece(to);

    if (piece.colour != this.colour) {
      return false;
    }

    if (!(piece instanceof Rook)) {
      return false;
    }

    if (piece.moved == true || this.moved == true) {
      return false;
    }

    if (this.getPos()[0] != piece.getPos()[0]) {
      return false;
    }

    let copy = this.game.copy();
    copy.board[piece.getPos()[0]][piece.getPos()[1]].pop();

    for (
      let i = Math.min(to[1], this.getPos()[1]) + 1;
      i < Math.max(to[1], this.getPos()[1]);
      i++
    ) {
      if (copy.getPiece([to[0], i]) != null) {
        return false;
      }
    }

    return true;
  }

  castle(to) {
    // [
    //   this.board.board[rook.getPos()[0]][rook.getPos()[1]],
    //   this.board.board[this.getPos()[0]][this.getPos()[1]],
    // ] = [
    //   this.board.board[this.getPos()[0]][this.getPos()[1]],
    //   this.board.board[rook.getPos()[0]][rook.getPos()[1]],
    // ];

    let rook = this.game.board[to[0]][to[1]].pop();
    let pos = this.getPos();
    this.moveToEmpty(to);
    this.game.board[pos[0]][pos[1]].push(rook);

    this.moved = true;
    rook.moved = true;
  }

  naiveMoveType(to) {
    //castle logic
    {
      if (this.naiveCastleLogic(to)) {
        return "castle";
      }
    }

    //innate piece logic
    {
      if (
        Math.abs(to[0] - this.getPos()[0]) > 1 ||
        Math.abs(to[1] - this.getPos()[1]) > 1
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
        } else {
          return "c";
        }
      }
    }

    return "m";
  }

  moveType(to) {
    if (this.game.getPiece(to) instanceof King) {
      return "k";
    }

    //if the move was valid ie not a logic error or occupied error
    if (this.naiveMoveType(to) != "l" && this.naiveMoveType(to) != "o") {
      let copy = this.game.copy();
      let self = copy.getPiece(this.getPos());

      //bad OOP. idc tho.
      //need to add new ifelse for each new movement option
      if (this.naiveMoveType(to) == "m") {
        self.moveToEmpty(to);
      } else if (this.naiveMoveType(to) == "c") {
        self.capture(to);
      } else if (this.naiveMoveType(to) == "castle") {
        //castle logic

        let rook = this.game.getPiece(to);
        copy.board[rook.getPos()[0]][rook.getPos()[1]].pop();

        let start = Math.min(to[1], self.getPos()[1]);
        let end = Math.max(to[1], self.getPos()[1]) + 1;

        for (let i = start; i < end; i++) {
          self.moveToEmpty([to[0], i]);

          if (copy.checked(this.colour)) {
            return "check";
          }
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

    if (moveType == "l") {
      console.log("piece movement logic error");
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

    if (moveType == "o") {
      console.log("trying to move into occupied square");
      return false;
    }

    if (moveType == "m") {
      this.moveToEmpty(to);
      console.log("moved to empty spot");
      this.moved = true;
      this.game.moves += 1;

      return true;
    }
    if (moveType == "c") {
      this.capture(to);
      this.moved = true;
      console.log("captured");
      this.game.moves += 1;

      return true;
    }
    if (moveType == "castle") {
      console.log("castled");
      this.castle(to);
      this.game.moves += 1;

      return true;
    }

    //crazy bug is this happens
    console.log("this should never happen");
    return false;
  }
}

export default King;
