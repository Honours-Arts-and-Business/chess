import King from "./Pieces/King";
import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import Pawn from "./Pieces/Pawn";

//makes more sense to be called Game instead but im too deep in to change it
class Game {
  constructor(game = null) {
    //copy
    if (game != null) {
      this.turnLogic = game.turnLogic;
      this.turn = game.turn;
      this.moves = game.moves;
      //instantiating
      this.board = [
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
      ];
      this.captured = [];

      //filling in board
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (game.getPiece([i, j]) != null) {
            let piece = game.getPiece([i, j]);
            this.board[i][j].push(piece.clone(this));
          }
        }
      }
      //filling in captured
      for (let i = 0; i < game.captured.length; i++) {
        this.captured.push(game.captured[i].clone(this));
      }
      return;
    } else {
      this.turnLogic = true;
      this.turn = true;
      this.moves = 0;
      this.board = [
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
      ];

      this.captured = [];

      this.board[0][0].push(new Rook(false, this));
      this.board[0][1].push(new Knight(false, this));
      this.board[0][2].push(new Bishop(false, this));
      this.board[0][3].push(new Queen(false, this));
      this.board[0][4].push(new King(false, this));
      this.board[0][5].push(new Bishop(false, this));
      this.board[0][6].push(new Knight(false, this));
      this.board[0][7].push(new Rook(false, this));

      this.board[7][0].push(new Rook(true, this));
      this.board[7][1].push(new Knight(true, this));
      this.board[7][2].push(new Bishop(true, this));
      this.board[7][3].push(new Queen(true, this));
      this.board[7][4].push(new King(true, this));
      this.board[7][5].push(new Bishop(true, this));
      this.board[7][6].push(new Knight(true, this));
      this.board[7][7].push(new Rook(true, this));

      for (let i = 0; i < 8; i++) {
        this.board[1][i].push(new Pawn(false, this));
        this.board[6][i].push(new Pawn(true, this));
      }
    }
  }

  simpleCopy() {
    let copy = [
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
    ];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].length == 0) {
          copy[i][j].push("-");
        } else {
          copy[i][j].push(this.board[i][j][0].toString());
        }
      }
    }

    return copy;
  }

  copy() {
    return new Game(this);
  }

  getPiece(pos) {
    if (this.board[pos[0]][pos[1]].length > 0) {
      return this.board[pos[0]][pos[1]][0];
    }
    return null;
  }

  move(from, to) {
    let pos = this.board[from[0]][from[1]]; //from MUST be coordinate of a piece
    if (pos.length == 0) {
      //kind of redundant since this method wont be called with invalid <from> coordinates
      console.log("tried moving an empty space");
      return false;
    }

    //Turn logic
    if (this.turnLogic) {
      if (pos[0].colour != this.turn) {
        console.log("not your turn");
        return false;
      }
      if (pos[0].validMove(to)) {
        this.turn = !this.turn;
      }
    }

    return pos[0].move(to); //piece move method needs to mutate board
  }

  getKing(colour) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          this.getPiece([i, j]) != null &&
          this.getPiece([i, j]) instanceof King &&
          this.getPiece([i, j]).colour == colour
        ) {
          return this.getPiece([i, j]);
        }
      }
    }
  }

  validMoveList(colour) {
    let r = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let piece = this.getPiece([i, j]);
        if (piece != null && piece.colour == colour) {
          r.push(piece.validMoveList());
        }
      }
    }
    return r;
  }

  naiveCheckingPieces(colour) {
    let pos = this.getKing(colour).getPos();
    let r = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          this.getPiece([i, j]) != null &&
          this.getPiece([i, j]).colour != this.colour &&
          this.getPiece([i, j]).naiveCanAttack(pos)
        ) {
          r.push(this.getPiece([i, j]));
        }
      }
    }
    return r;
  }

  checked(colour) {
    let king = this.getKing(colour);

    if (
      this.naiveCheckingPieces(colour).length != 0 &&
      this.naiveCheckingPieces(!colour).length != 0
    ) {
      return true;
    }
    if (this.naiveCheckingPieces(colour).length == 0) {
      return false;
    }
    for (let i = 0; i < this.naiveCheckingPieces(colour).length; i++) {
      let copy = this.copy();
      let attacker = copy.getPiece(
        this.naiveCheckingPieces(colour)[i].getPos()
      );
      attacker.capture(king.getPos());

      if (copy.naiveCheckingPieces(!colour).length == 0) {
        return true;
      }
    }
    return false;
  }

  checkMate(colour) {
    for (let i = 0; i < this.validMoveList(colour).length; i++) {
      if (this.validMoveList(colour)[i].length != 0) {
        return false;
      }
    }

    if (!this.checked(colour)) {
      return false;
    }

    return true;
  }

  staleMate(colour) {
    for (let i = 0; i < this.validMoveList(colour).length; i++) {
      if (this.validMoveList(colour)[i].length != 0) {
        return false;
      }
    }

    if (this.checked(colour)) {
      return false;
    }

    return true;
  }

  toggleTurnLogic() {
    this.turnLogic = !this.turnLogic;
  }

  //checks if checkmates happend, stalemates, deadend etc
  gameState() {}
}

export default Game;
