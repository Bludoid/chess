///////////////////////////////////////////
//   chess board in HTML/CSS/JavaScript  //
///////////////////////////////////////////



let colorCounter = 1;
let board = document.getElementById("board");
let whiteMove = true;         // true => white's move, false => black's move

let infobox = document.getElementById("infobox");
let moveBox = document.getElementById("moveLogger");
let moveNumber = 1;

let activateEnPassant = false;
let enPassantInProgress = false;
let pawnsAbleToEnPassant = [];
let pawnInEnPassant = [];
let enPassantExecutionStarted = false;

let whitePromotion = false;

// not used yet:
let whiteInCheck = false;    // if true => check or checkmate happening
let blackInCheck = false;

let whiteKingID = 61;
let blackKingID = 5;

let boardArrayBackup;

// validMoves = [];

let moveInProgress = false;
let chosenSquare = null;

// A for long, H for short castling
let abilityToCastle = { whiteA: true, whiteH: true, blackA: true, blackH: true };

// array or arrays with empty member on index 0
// 64 squares represented as ['r', 'b', 'a', 8] (piece, color, File, file), indexes 0 and 1 possibly "e" for empty square
let boardArray = [
  [],
  ['r', 'b', 'a', 8], ['n', 'b', 'b', 8], ['b', 'b', 'c', 8], ['q', 'b', 'd', 8], ['k', 'b', 'e', 8], ['b', 'b', 'f', 8], ['n', 'b', 'g', 8], ['r', 'b', 'h', 8],
  ['p', 'b', 'a', 7], ['p', 'b', 'b', 7], ['p', 'b', 'c', 7], ['p', 'b', 'd', 7], ['p', 'b', 'e', 7], ['p', 'b', 'f', 7], ['p', 'b', 'g', 7], ['p', 'b', 'h', 7], 
  ['e', 'e', 'a', 6], ['e', 'e', 'b', 6], ['e', 'e', 'c', 6], ['e', 'e', 'd', 6], ['e', 'e', 'e', 6], ['e', 'e', 'f', 6], ['e', 'e', 'g', 6], ['e', 'e', 'h', 6],
  ['e', 'e', 'a', 5], ['e', 'e', 'b', 5], ['e', 'e', 'c', 5], ['e', 'e', 'd', 5], ['e', 'e', 'e', 5], ['e', 'e', 'f', 5], ['e', 'e', 'g', 5], ['e', 'e', 'h', 5],
  ['e', 'e', 'a', 4], ['e', 'e', 'b', 4], ['e', 'e', 'c', 4], ['e', 'e', 'd', 4], ['e', 'e', 'e', 4], ['e', 'e', 'f', 4], ['e', 'e', 'g', 4], ['e', 'e', 'h', 4],
  ['e', 'e', 'a', 3], ['e', 'e', 'b', 3], ['e', 'e', 'c', 3], ['e', 'e', 'd', 3], ['e', 'e', 'e', 3], ['e', 'e', 'f', 3], ['e', 'e', 'g', 3], ['e', 'e', 'h', 3],
  ['p', 'w', 'a', 2], ['p', 'w', 'b', 2], ['p', 'w', 'c', 2], ['p', 'w', 'd', 2], ['p', 'w', 'e', 2], ['p', 'w', 'f', 2], ['p', 'w', 'g', 2], ['p', 'w', 'h', 2],
  ['r', 'w', 'a', 1], ['n', 'w', 'b', 1], ['b', 'w', 'c', 1], ['q', 'w', 'd', 1], ['k', 'w', 'e', 1], ['b', 'w', 'f', 1], ['n', 'w', 'g', 1], ['r', 'w', 'h', 1]
 ];

// create the board and add click ability to the squares
for(let i = 0; i<64; i++) {
  let thisSquare = document.createElement("div");
  thisSquare.id = i+1;
  thisSquare.addEventListener("click", function() {

    //console.log("this is a square number: " + thisSquare.id);
    if (!moveInProgress && isPlayersTurnAndPiece(thisSquare.id)) {
      // user selected a piece to move (there was no other piece selected before)
      markPossibleMove(thisSquare); 
    }
    else if (moveInProgress && thisSquare == chosenSquare) {
      // same piece clicked twice ==> highlight/unhighlight ==> move in progress canceled 
      clearSquare(chosenSquare);
    }
    else if (isPlayersTurnAndPiece(thisSquare.id)) {
      // player clicked another of his pieces (player selected a different piece to move)
      clearSquare(chosenSquare);
      markPossibleMove(thisSquare);
    }
    else if (!moveInProgress && isEmptySquare(thisSquare.id)) {
      // player clicked an empty square instead of his piece
      console.log("This is an empty square!");
    }
    else if (!moveInProgress && isOpponentsPiece(thisSquare.id)) {
      // player clicked an opponent's piece instead of his piece
      console.log("It is not this colour's move!");
    }
    else if (isOpponentsPiece(thisSquare.id)) {
      // a square is highlighted and player clicked opponent's piece ==> if valid, a take happening
      // if (validSquares.includes(thisSquare))  {
      
      if (isValidMove(thisSquare)) {
        takePiece(chosenSquare, thisSquare);
      }
      else {
        clearSquare(chosenSquare);
      }
    }
    else if (isEmptySquare(thisSquare.id)) {
      // a square is hightlighted and player clicked empty square ==> if valid, a move happening
      //console.log(thisSquare.id);
      if (isValidMove(thisSquare))  {
        console.log("moving to an empty square");
        executeMove(chosenSquare, thisSquare);
      }
      else {
        clearSquare(chosenSquare);
      }
    }
  })
  // appending squares to board and giving them class names
  board.appendChild(thisSquare)
  if(colorCounter%2 == 1){
    thisSquare.className = "whiteSquare";
  }
  else{
    thisSquare.className = "blackSquare"; 
  }
  // new File of squares (adding <br>)
  if((i+1)%8 === 0) {
    let breakLine = document.createElement("br");
    board.appendChild(breakLine);
    colorCounter++;
  }
  colorCounter++;
}

// places a piece on the board given the square and shortcut of the piece ("pb" - pawn black)
function placePiece(square, pieceName) {
  let newPiece = document.createElement("img");
  let pathString = "img/" + pieceName + ".png";   // puts together the name of the image
  newPiece.src = pathString;
  //newPiece.className = pieceName;
  square.appendChild(newPiece);
}

// removes any piece from the given square by clearing its inner HTML
function removePiece(square) {
  square.innerHTML = "";
}

// highlights the given square by adding a class, highlighting happens in CSS
function highlightSquare(square) {
  square.classList.add("highlighted");
}

// removes the class/highlight from the given square
function unhighlightSquare(square) {
  square.classList.remove("highlighted");
}

// checks if the square contains a piece and if it belongs to the player who's turn it is - if yes, returns true
// if it's not the right player's turn or the square is empty, returns false
function isPlayersTurnAndPiece(squareID) {
  return ((boardArray[squareID][1] == "w" && whiteMove) || (boardArray[squareID][1] == "b" && !whiteMove)); 
}

// returns true if the square is empty
function isEmptySquare(squareID) {
  return (boardArray[squareID][0] == "e");
}

function isOpponentsPiece(squareID) {
  return ((!whiteMove && boardArray[squareID][1] == "w") || (whiteMove && boardArray[squareID][1] == "b"));
}

// clears the square (unhighlights it); variables chosenSquare and moveInProgress are reset
// used after a move was made or canceled (canceled by chosing different square or move is not valid) 
function clearSquare(square) {
  unhighlightSquare(square);
  chosenSquare = null;
  moveInProgress = false;
}

function takePiece(takingPieceSquare, takenPieceSquare) {
  // taking a piece
  removePiece(takenPieceSquare);
  executeMove(takingPieceSquare, takenPieceSquare);
}

// creates backup for the boardArray
// checks if a move is valid for different pieces:
// switch case calls a specific function which returns true a move is valid (example - bishop can move diagonally)
// then tests (simulates) a move for potential self checks
// if no checks would happen, move is allowed
// if checks would happen, move is canceled and board array is restored
function isValidMove(square) {
  let pieceShortcut = boardArray[chosenSquare.id][0];
  boardArrayBackup = structuredClone(boardArray);
  console.log("checking move validity for piece: " + pieceShortcut);
  let returnValue = false;
 
  switch (pieceShortcut) {
    case "p": 
        if (boardArray[chosenSquare.id][1] == "w") {
          if (isWhitePawnMove(square)) returnValue = true;
        }
        else {
          if (isBlackPawnMove(square)) returnValue = true;
        }
      break;
    case "r":
      if (isRookMove(square)) returnValue = true;
       break;
    case "n": 
      if (isKnightMove(square)) returnValue = true;
      break;
    case "b": 
      if (isBishopMove(square)) returnValue = true;
      break;
    case "q": 
      if (isQueenMove(square)) returnValue = true;
      break;
    case "k": 
      if (isKingMove(square)) {
        returnValue = true;
        //kingBackupID = whiteMove? whiteKingID : blackKingID;
        whiteMove? whiteKingID = square.id : blackKingID = square.id;
      }
      break;
  }
  if (returnValue) {
    // updates the board and checks for potentional self checks
    // could be done by simulateMove() function????????????
    boardArray[square.id][0] = boardArray[chosenSquare.id][0]; 
    boardArray[chosenSquare.id][0] = "e";
    boardArray[square.id][1] = boardArray[chosenSquare.id][1]; 
    boardArray[chosenSquare.id][1] = "e";
    let kingAttackers = getAttackersOfSquare(whiteMove? whiteKingID : blackKingID); 
    if (kingAttackers.length) {
      if (boardArray[square.id][0] == "k") {
        whiteMove? whiteKingID = chosenSquare.id : blackKingID = chosenSquare.id;
      }
      else if (enPassantExecutionStarted) {enPassantExecutionStarted = false;}
      boardArray = structuredClone(boardArrayBackup);
      return false;
    }
    else {return true;}
  }
}

//////////////////////////////////////

function isWhitePawnMove(square) {
  if (!isSameFile(square.id)) {
    if (enPassantInProgress) {
      if (pawnsAbleToEnPassant.includes(chosenSquare.id) && square.id == pawnInEnPassant[0] - 8) {
          enPassantExecutionStarted = true;
          // update board array when en passanting: 
          boardArray[pawnInEnPassant[0]][0] = "e";
          boardArray[pawnInEnPassant[0]][1] = "e";
          return true;
      }
    }
    else {
      return ([-9, -7].includes(square.id-chosenSquare.id) && isSameSquareColor(square) && isOpponentsPiece(square.id));
    }    
  }
  
  else {
    // initial 2 square move of a pawn
    if ((boardArray[chosenSquare.id][3] == 2) && (boardArray[square.id][3] == 4) && 
        isEmptySquare(chosenSquare.id - 8) && isEmptySquare(square.id)) {
      // en passant logic:
      let possibleAttackingPawn = document.getElementById(square.id-1);
      let possibleAttackingPawn2 = document.getElementById(Number(square.id)+1);
      if (enPassantInProgress) {
        pawnInEnPassant = [];
        pawnsAbleToEnPassant = [];
      }
      if (boardArray[possibleAttackingPawn.id][0] == "p" && 
        !isSameSquareColor(possibleAttackingPawn) && isOpponentsPiece(possibleAttackingPawn.id)) {
        pawnsAbleToEnPassant.push(possibleAttackingPawn.id);    // storing file of pawn that can take en passant
        pawnInEnPassant.push(square.id); 
        activateEnPassant = true; 
      }
      if (boardArray[possibleAttackingPawn2.id][0] == "p" && 
          !isSameSquareColor(possibleAttackingPawn2) && isOpponentsPiece(possibleAttackingPawn2.id)) {
        pawnsAbleToEnPassant.push(possibleAttackingPawn2.id);
        pawnInEnPassant.push(square.id);
        activateEnPassant = true;  
      }     
      return true;
    }
    else {return ((square.id == chosenSquare.id - 8) && isEmptySquare(square.id));}
  }
}

function isBlackPawnMove(square) {
  if (!isSameFile(square.id)) {
    if (enPassantInProgress) {
      if (pawnsAbleToEnPassant.includes(chosenSquare.id) && square.id == Number(pawnInEnPassant[0]) + 8) {
          enPassantExecutionStarted = true;
          // update board array:
          boardArray[pawnInEnPassant[0]][0] = "e";
          boardArray[pawnInEnPassant[0]][1] = "e";
          return true;
      }
    }
    else {
      return ([9, 7].includes(square.id-chosenSquare.id) && isSameSquareColor(square) && isOpponentsPiece(square.id));
    }    
  }
 
  // initial 2 square move of a pawn 
  else {
    if ((boardArray[chosenSquare.id][3] == 7) && (boardArray[square.id][3] == 5) && 
        isEmptySquare(Number(chosenSquare.id) + 8) && isEmptySquare(square.id)) {
      // en passant logic:    
      let possibleAttackingPawn = document.getElementById(square.id-1);
      let possibleAttackingPawn2 = document.getElementById(Number(square.id)+1);
      if (enPassantInProgress) {
        pawnInEnPassant = [];
        pawnsAbleToEnPassant = [];
      }
      if (boardArray[possibleAttackingPawn.id][0] == "p" && 
        !isSameSquareColor(possibleAttackingPawn) && isOpponentsPiece(possibleAttackingPawn.id)) {
        pawnsAbleToEnPassant.push(possibleAttackingPawn.id);  // storing file of pawn that can take en passant
        pawnInEnPassant.push(square.id);                      // storing file of a pawn that can be taken en passant
        activateEnPassant = true;                    
      }
      if (boardArray[possibleAttackingPawn2.id][0] == "p" && 
        !isSameSquareColor(possibleAttackingPawn2) && isOpponentsPiece(possibleAttackingPawn2.id)) {
        pawnsAbleToEnPassant.push(possibleAttackingPawn2.id);
        pawnInEnPassant.push(square.id); 
        activateEnPassant = true; 
      } 
      return true;
    }
    else {return ((square.id == Number(chosenSquare.id) + 8)) && isEmptySquare(square.id);}
  }
}


function isRookMove(square) {
  if (isHorizontalOrVerticalPath(square, getHorizontalOrVerticalDirection(square.id))) {return true;} 
}

// checks if id's of start and end square corespond to a knight move
// also checks for squares not having the same color (takes care of knight being close to the board rim)
function isKnightMove(square) {
  if (([-17, 17, -15, 15, -10, 10, -6, 6].includes(square.id-chosenSquare.id)) && !isSameSquareColor(square)) {
    return true;
  }
}


// Object.is(0, -0) will give false, but 0==-0 will give true

function isBishopMove(square) {
  return isDiagonalPath(square, getDiagonalDirection(square.id));
}

function isQueenMove(square) {
  return (isHorizontalOrVerticalPath(square, getHorizontalOrVerticalDirection(square.id)) ||
    isDiagonalPath(square, getDiagonalDirection(square.id)));
}

function isKingMove(square) {
  let idDifference = square.id - chosenSquare.id;
  console.log("validation of king move to square: " + square.id);
  if (([-9, 9, -7, 7].includes(idDifference) && isSameSquareColor(square)) || 
      ([-8, 8, -1, 1].includes(idDifference) && !isSameSquareColor(square))) {
      return true;
    }
  if (whiteMove && !whiteInCheck) {
    if (square.id == 59 && abilityToCastle.whiteA) {
      console.log("white king wants to casle long!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      // using arrow function and "num" to get around !isSquareCheck (would try to negate the function reference itself)
      if ([58, 59, 60].every(isEmptySquare) && !isPathChecked([58, 59, 60])) {
        rookCastling(57, 60, "rw");
        return true;
      }
    }
    else if (square.id == 63 && abilityToCastle.whiteH) {
      console.log("white king wants to casle short!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      if ([62, 63].every(isEmptySquare) && !isPathChecked([62, 63])) {
        rookCastling(64, 62, "rw");
        return true;
      }
    }
  }
  else if (!blackInCheck) {
    if (square.id == 3 && abilityToCastle.blackA) {
      console.log("black king wants to casle long!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      if ([2, 3, 4].every(isEmptySquare) && !isPathChecked([2, 3, 4])) {
        rookCastling(1, 4, "rb");
        return true;
      }
    }
    else if (square.id == 7 && abilityToCastle.blackH) {
      console.log("black king wants to casle short!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      if ([6, 7].every(isEmptySquare) && !isPathChecked([6, 7])) {
        rookCastling(8, 6, "rb");
        return true;
      }
    }    
  }
}

// helper function for evaluating checks in the Castling area
function isPathChecked(arrayOfSquareIDs) {
  let attackersArray;
  for (let square of arrayOfSquareIDs) {
    attackersArray = getAttackersOfSquare(square);
    if (attackersArray.length) {
      return true;
    }
  }
}

// executes the castling move for rook (player moves the king so that is done the normal way)
function rookCastling(rookPosition, newRookPosition, rookName) {
  boardArray[newRookPosition][0] = "r"; 
  boardArray[rookPosition][0] = "e";
  boardArray[newRookPosition][1] = rookName[1]; 
  boardArray[rookPosition][1] = "e";
  removePiece(document.getElementById(rookPosition));
  placePiece(document.getElementById(newRookPosition), rookName);
}

// disables castling if it is not possible anymore
function disableCastlingWhite() {
  abilityToCastle.whiteA = false;
  abilityToCastle.whiteH = false;
}

function disableCastlingBlack() {
  abilityToCastle.blackA = false;
  abilityToCastle.blackH = false;
}



/////////////////////////////////////////////////

function isSameRank(squareID, otherSquareID = chosenSquare.id) {
  return (boardArray[squareID][3] == boardArray[otherSquareID][3]); 
}

function isSameFile(squareID) {
  return (boardArray[chosenSquare.id][2] == boardArray[squareID][2]); 
}

function isSameSquareColor(square, otherSquare = chosenSquare) {
  return (square.classList.contains("blackSquare") && otherSquare.classList.contains("blackSquare"))
  || (square.classList.contains("whiteSquare") && otherSquare.classList.contains("whiteSquare")); 
}

function isAFile() {
  return (boardArray[chosenSquare.id][2] == "a"); 
}

function isHFile() {
  return (boardArray[chosenSquare.id][2] == "h"); 
}

// not used???
function isDiagonal(square) {
  let differenceOfSquareID = square.id - chosenSquare.id;
  console.log(differenceOfSquareID);
  if (differenceOfSquareID % 9 == 0 || differenceOfSquareID % 7 == 0) {
    return true;
  }
}

// not used????????????????????????????
// direction: 0 => top/left, 1 => top/right, 2 => bottom/right, 3 => bottom/left
function isDiagonalNeighbour(square, direction) {
  switch(direction) {
    // top/left
    case 0:
      if (isAFile()) {return false};
      return (square.id == chosenSquare.id - 9);
    // top/right
    case 1:
      if (isHFile()) {return false};
      return (square.id == chosenSquare.id - 7);
    // bottom/right
    case 2:
      if (isHFile(square)) {return false};
      console.log("checking for bottom/right diagonal direction");
      return (square.id == Number(chosenSquare.id) + 9);
    // bottom/left
    case 3:
      if (isAFile(square)) {return false};
      console.log("checking for bottom/left diagonal direction");
      return (square.id == Number(chosenSquare.id) + 7);
    default:
      console.log("error");
  }
}

// returns diagonal direction
function getDiagonalDirection(squareID, otherSquareID = chosenSquare.id) {
  let directionHelper = squareID - otherSquareID;
  switch(true) {
    // top/left
    case (Object.is(directionHelper % 9, -0)):
      return 0;
    // top/right:
    case (Object.is(directionHelper % 7, -0)):
      return 1;
    // bottom/right:
    case (directionHelper % 9 == 0):
      return 2;
    // bottom/left:
    case (directionHelper % 7 == 0):
      return 3;
    default:
      console.log("not diagonal direction");
  }
}

function isDiagonalPath(endSquare, direction) {
  
  // checking for same color of start and ending square
  // for situation where %7 allows to move to wrong place (such squares are of different square color)
  if (!isSameSquareColor(endSquare)) {
    return false;
  }
  
  let endSquareID = Number(endSquare.id);
  let currentID = Number(chosenSquare.id); 
  switch(direction) {
    // top/left:
    case 0:
      currentID -= 9;
      while (currentID > endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID -= 9;
      }
      return true;
    // top/right:
    case 1:
      currentID -= 7;
      while (currentID > endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID -= 7;
      }
      return true;

    // bottom/right:
    case 2:
      currentID += 9;
      while (currentID < endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID += 9;
      }
      return true;

    // bottom/left:
    case 3:
      currentID += 7;
      while (currentID < endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID += 7;
      }
      return true;

    default:
      console.log("error in handling diagonal path move");
  }
}

function getHorizontalOrVerticalDirection(squareID, otherSquareID = chosenSquare.id) {
  let directionHelper = squareID - otherSquareID;
  switch(true) {
    // up
    case ([-8, -16, -24, -32, -40, -48, -56].includes(directionHelper)):
      console.log("top");
      return 0;
    // right:
    case ([1, 2, 3, 4, 5, 6, 7].includes(directionHelper)):
      console.log("right");
      return 1;
    // down:
    case ([8, 16, 24, 32, 40, 48, 56].includes(directionHelper)):
      console.log("bottom");
      return 2;
    // left:
    case ([-1, -2, -3, -4, -5, -6, -7].includes(directionHelper)):
      console.log("left");
      return 3;
    default:
      // console.log("other direction than horizontal or vertical");
      // will this be needed??????????????,
      return undefined;
  }
}

function isHorizontalOrVerticalPath(endSquare, direction) {
  // taking care of rim of the board positioning
  if ((!isSameFile(endSquare.id)) && (!isSameRank(endSquare.id))) {
    return false;
  }

  let endSquareID = Number(endSquare.id);
  let currentID = Number(chosenSquare.id); 
  switch(direction) {
    // up:
    case 0:
      currentID -= 8;
      while (currentID > endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID -= 8;
      }
      return true;

    // right:
    case 1:
      currentID += 1;
      while (currentID < endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID += 1;
      }
      return true;

    // down:
    case 2:
      currentID += 8;
      while (currentID < endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID += 8;
      }
      return true;

    // left:
    case 3:
      currentID -=1;
      while (currentID > endSquareID) {
        if (!isEmptySquare(currentID)) {
          return false;
        }
        currentID -=1;
      }
      return true;

    default:
      console.log("error in horizontal or vertical path move");
  }
}

/////////////////////////////////////////////////////////////////////////////////////

/// pawn promotion helper functions:

function isPawnPromotion(square) {
  //console.log("checking promotion of the pawn");
  return (boardArray[square.id][0] == "p" && 
    (boardArray[square.id][3] == 8 || boardArray[square.id][3] == 1));
}

function promotePawn(square) {
  square.classList.toggle("promotionFocus");
  toggleClicking();
  console.log("promoting a pawn on square " + square.id);
  let promotionInfobox = document.getElementById("promotionInfo");
  promotionInfobox.classList.toggle("hideInfo"); 
  promotionInfobox.classList.toggle("displayFlex");
  
  // Backticks (`) are a type of quotation mark used in JavaScript for creating template literals.
  // Template literals in JavaScript are strings enclosed with backticks (`) that allow for more flexibility 
  // than regular strings created with single (') or double (") quotes.
  // The ${} syntax inside the backticks allows us to insert the value of variables directly into the string.

  if (whiteMove) {
    promotionInfobox.innerHTML = `
      <span> PROMOTE TO: </span>
      <img src="img/qw.png" onclick="(() => choosePromotion('qw', '${square.id}'))()">
      <img src="img/rw.png" onclick="(() => choosePromotion('rw', '${square.id}'))()">
      <img src="img/bw.png" onclick="(() => choosePromotion('bw', '${square.id}'))()">
      <img src="img/nw.png" onclick="(() => choosePromotion('nw', '${square.id}'))()">
    `; 
  } else {
    promotionInfobox.innerHTML = `
      <span> PROMOTE TO: </span>
      <img src="img/qb.png" onclick="(() => choosePromotion('qb', '${square.id}'))()">
      <img src="img/rb.png" onclick="(() => choosePromotion('rb', '${square.id}'))()">
      <img src="img/bb.png" onclick="(() => choosePromotion('bb', '${square.id}'))()">
      <img src="img/nb.png" onclick="(() => choosePromotion('nb', '${square.id}'))()">
    `; 
  }
}

function choosePromotion(chosenPiece, squareID) {
  console.log("Clicked image ID:", chosenPiece);
  console.log("destination of the desired piece is: " + squareID);
  boardArray[squareID][0] = chosenPiece[0];
  let promotionSquare = document.getElementById(squareID);
  promotionSquare.innerHTML = "";
  placePiece(promotionSquare, chosenPiece);
  let promotionInfobox = document.getElementById("promotionInfo");
  
  // time delay before the promotion infobox is hidden
  const myTimeout = setTimeout(() => {
    promotionInfobox.innerHTML = "";
    promotionInfobox.classList.toggle("displayFlex");
    promotionInfobox.classList.toggle("hideInfo");
  }, 500);
  
  promotionSquare.classList.toggle("promotionFocus");
  switchMove();
  toggleClicking(); 
}

function toggleClicking() {
  let chessBoard = document.getElementById("board");
  chessBoard.classList.toggle("disableClicks");
}

/////////////////////////////////////////////////////////////////////////////////////

// checking king or empty square for checks


// when whiteMove is true (it's white's move), looks for attackers of black color
// when whiteMove is false (it's black's move), looks for attackers of white color  
// returns an array which is empty (no attackers), has one attacker ID (single check) or two ID's (double check)
function getAttackersOfSquare(squareID) {
  let attackers = [];
  // checking vertical directions for checks from  rook and queen
  for (let direction of [-8, 8]) {
    let exploredSquareID = Number(squareID) - direction;
    while (isSquareOnBoard(exploredSquareID)) {
      if (isEmptySquare(exploredSquareID)) {
        exploredSquareID -= direction;
        continue;
      }
      else if (isPlayersTurnAndPiece(exploredSquareID)) {break;}
      else {
        if (["q", "r"].includes(boardArray[exploredSquareID][0])) {attackers.push(exploredSquareID);}
        break;
      }
    }
  }

  // checking horizontal directions for checks from  rook and queen
  for (let direction of [-1, 1]) {
    exploredSquareID = Number(squareID) - direction;
    while (isSquareOnBoard(exploredSquareID) && isSameRank(exploredSquareID, squareID))  {
      if (isEmptySquare(exploredSquareID)) {
        exploredSquareID -= direction;
        continue;
      }
      else if (isPlayersTurnAndPiece(exploredSquareID)) {break;}
      else {
        if (["q", "r"].includes(boardArray[exploredSquareID][0])) {attackers.push(exploredSquareID);}
        break;
      }
    }
  }

  // checking diagonal directions for check from queen and bishop
  for (let direction of [-7, 7, -9, 9]) {
    exploredSquareID = Number(squareID) - direction;
    while (isSquareOnBoard(exploredSquareID) && isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(squareID))) {
      if (isEmptySquare(exploredSquareID)) {
        exploredSquareID -= direction;
        continue;
      }
      else if (isPlayersTurnAndPiece(exploredSquareID)) {break;}
      else {
        if(["q", "b"].includes(boardArray[exploredSquareID][0])) {attackers.push(exploredSquareID);}
        break;
      }
    }
  }

  // checking for checks from knights
  for (let explored of [-17, 17, -15, 15, -10, 10, -6, 6]) {
    exploredSquareID = Number(squareID) - explored;
    if (isSquareOnBoard(exploredSquareID) && 
      !isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(squareID)) &&
      isOpponentsPiece(exploredSquareID) && boardArray[exploredSquareID][0] == "n") {
        attackers.push(exploredSquareID);
    }
  }

  // checknig for checks from pawns
  let pawnDirections = whiteMove? [9,7] : [-9, -7];
  for (let direction of pawnDirections) {
    exploredSquareID = Number(squareID) - direction;
    if (isSquareOnBoard(exploredSquareID)  && 
      isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(squareID)) &&
      isOpponentsPiece(exploredSquareID) && boardArray[exploredSquareID][0] == "p") {
        attackers.push(exploredSquareID);;
    }
  }
  
  // checking for checks from king
  // (for kings cannot get too close to each other and king can check empty squares in castling area)
  // diagonal directions
  for (let explored of [-9, -7, +9, +7]) {
    exploredSquareID = Number(squareID) - explored;
    if (isSquareOnBoard(exploredSquareID) && 
      isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(squareID)) &&
      isOpponentsPiece(exploredSquareID) && boardArray[exploredSquareID][0] == "k") {
        attackers.push(exploredSquareID);
    }
  }

  // checking for checks from king
  // horizontal and vertical directions
  for (let explored of [-8, +8, -1, +1]) {
    exploredSquareID = Number(squareID) - explored;
    if (isSquareOnBoard(exploredSquareID) && 
      !isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(squareID)) &&
      isOpponentsPiece(exploredSquareID) && boardArray[exploredSquareID][0] == "k") {
        attackers.push(exploredSquareID);
    }
  }

  return attackers;
}

// returns true if squareID is between 1 and 64 (inclusive)
function isSquareOnBoard(squareID) {
  return (squareID > 0 && squareID < 65)
}

/////////////////////////////////////////////////////////////////////////////////////

// CHECKMATE LOGIC FUNCTIONS:

  //checks if king can move OR attacker can be taken OR attack can be blocked
  // if all of them return false, then checkmate happened - this function returns true
function isCheckmate(attackerID) {
  return (!canKingMove() && !canAttackerBeTaken(attackerID) && !canAttackBeBlocked(attackerID));
}

  // used by isCheckmate
  // when double check in effect, check cannot be relieved by take or block so it is used to detect checkmate
function canKingMove() {
  let kingPosition = whiteMove ? whiteKingID : blackKingID;
  let exploredSquareID;
  let attackers;
  // horizontals and verticals:
  for (let explored of [-8, +8, -1, +1]) {
    exploredSquareID = kingPosition - explored;
    if (isSquareOnBoard(exploredSquareID) && 
      !isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(kingPosition)) &&
      !isPlayersTurnAndPiece(exploredSquareID)) {
      if (simulateKingMove(exploredSquareID, kingPosition)) {
        console.log("king has at least one square to move: " + exploredSquareID);
        return true;
      }
    }
  }
  // diagonals:
  for (let explored of [-9, -7, +9, +7]) {
    exploredSquareID = kingPosition - explored;
    if (isSquareOnBoard(exploredSquareID) && 
      isSameSquareColor(document.getElementById(exploredSquareID), document.getElementById(kingPosition)) &&
      !isPlayersTurnAndPiece(exploredSquareID)) {
      if (simulateKingMove(exploredSquareID, kingPosition)) {
        console.log("king has at least one square to move: " + exploredSquareID);
        return true;} 
    }
  }
  console.log(">->-> king CANNOT move");
  return false;
}

function canAttackerBeTaken(attackerID) {
  let attackersOfAttacker;
  // temporarily switching the active player to get attackers from the active player's view
  // ex.: it's white's turn, black is checking, attackersOfAttacker are white pieces attacking black checking piece
  whiteMove = !whiteMove;
  attackersOfAttacker = getAttackersOfSquare(attackerID);
  whiteMove = !whiteMove;
  
  //for members of attackersOfAttacker run a function to check if it would not cause a self check
  if (attackersOfAttacker.some(defenderID => simulateMove(attackerID, defenderID))) {
    console.log(">->-> attacker can be taken");
    return true;
  }
  // checking piece is a pawn in enpassant, find out if it can be taken en passant to relieve the check 
  // (simulate the en passant move in simulateMove() with optional parameter)
  else if (enPassantInProgress && attackerID == pawnInEnPassant[0]) {
    for (defenderID of pawnsAbleToEnPassant) {
      // practical use of ternary operation, could be used also elsewhere in the code!!!!!!!!!!
      if (simulateMove(attackerID + (whiteMove ? -8 : 8), defenderID, true)) {return true;}
    }
  }
  console.log(">->-> attacker CANNOT be taken");
  return false;
}

function canAttackBeBlocked(attackerID) {
  
  // attacks from pawns and knights cannot be blocked:
  if (["p", "n"].includes(boardArray[attackerID][0])) {
    console.log(">->-> attack from pawn or knight CANNOT be blocked")
    return false;
  }

  let blockablePath = getKingToAttackerPath(attackerID);
  // attack from right beside king cannot be blocked
  if (!blockablePath.length) {return false;}

  for (let blockableSquareID of blockablePath) {
    // temporary switch who's move it is
    whiteMove = !whiteMove;
    const blockingCandidates = getAttackersOfSquare(blockableSquareID); // get the path that can potentialy be blocked
    whiteMove = !whiteMove;
    // delete false blocking candidates - pawns and a king:
    deleteFalseBlockers(blockingCandidates);
    // add correct pawn blocking candidates:
    addCorrectPawnBlockers(blockableSquareID, blockingCandidates);
    // simulate moves of candidates, return true if it can block without checking its own king
    for (let blockingCandidate of blockingCandidates) {
      if (simulateMove(blockableSquareID, blockingCandidate)) {
        console.log("attack at square: "+ attackerID + " CAN be blocked at least by a piece at: " + blockingCandidate);
        return true;
      }
    }
    console.log(">->-> attack CANNOT be blocked");
  }
}

// returns true if a piece can move to a specific square without putting its own king in check
function simulateMove(squareToGoID, pieceID, enPassantTake = false) {
  boardArrayBackup = structuredClone(boardArray);
  let pieceShortcut = boardArray[pieceID][0];
  let attackersArray = [];

  // if king can take attacker, it's taken care of by canKingMove()
  // otherwise king CANNOT block a check on itself -> return false
  if (pieceShortcut == "k") {return false;}  
  else {
    boardArray[squareToGoID][0] = pieceShortcut;
    boardArray[pieceID][0] = "e";
    boardArray[squareToGoID][1] = boardArray[pieceID][1]; 
    boardArray[pieceID][1] = "e";
    if (enPassantTake) {
      boardArray[pawnInEnPassant[0]][0] = "e";
      boardArray[pawnInEnPassant[0]][1] = "e";
    }
    attackersArray = getAttackersOfSquare(whiteMove? whiteKingID : blackKingID);
    boardArray = structuredClone(boardArrayBackup);
    //console.log("piece ID and a square ID to block attack or to take attacker: " + pieceID + ", " + squareToGoID);
    if (!attackersArray.length) {
      console.log("piece at: " + pieceID + " CAN safely (take a piece at / move to) square: " + squareToGoID);
      return true;
    } 
    else {
      console.log("piece at: " + pieceID + " CANNNOT safely (take a piece at / move to) square: " + squareToGoID);
    }
  }
}

// returns true if king can move to a specific square without putting itself into check
function simulateKingMove(squareToGoID, kingID) {
  boardArrayBackup = structuredClone(boardArray);
  console.log("king position ID and a square to go ID: " + kingID + ", " + squareToGoID);
  let pieceShortcut = "k";
  let attackersArray = [];
 
  boardArray[squareToGoID][0] = pieceShortcut;
  boardArray[kingID][0] = "e";
  boardArray[squareToGoID][1] = boardArray[kingID][1]; 
  boardArray[kingID][1] = "e";
  attackersArray = getAttackersOfSquare(squareToGoID);
  boardArray = structuredClone(boardArrayBackup);
  if (!attackersArray.length) {
    console.log("the king at: " + kingID + " CAN safely go at least to a square: " + squareToGoID);
    return true;
  } 
  else {
    console.log("the king at: " + kingID + " CANNOT safely go to a square: " + squareToGoID);
  }
}

function getKingToAttackerPath(squareToGoID) {
  let kingID = whiteMove? whiteKingID : blackKingID;
  let attackerDirection = getHorizontalOrVerticalDirection(squareToGoID, kingID);
  // bottom or up
  if ([0, 2].includes(attackerDirection)) {
    return getPathArray(squareToGoID, kingID, 8);
  }
  // left or right
  else if([1, 3].includes(attackerDirection)) {
    return getPathArray(squareToGoID, kingID, 1); 
  }
  else {
    attackerDirection = getDiagonalDirection(squareToGoID, kingID);
    // left/top or bottom/right
    if ([0, 2].includes(attackerDirection)) {
      return getPathArray(squareToGoID, kingID, 9);
    }
    // right/top or bottom/left
    else if([1, 3].includes(attackerDirection)) {
      return getPathArray(squareToGoID, kingID, 7);
    }
  }  
}

// returns ID's of squares between checked king and the attacker, returns empty array if they are neighbours
function getPathArray(squareToGoID, kingID, directionOffset) {
  let path = [];
  if (squareToGoID > kingID) {
    squareToGoID -= directionOffset;
    while (squareToGoID > kingID) {
      path.push(squareToGoID);
      squareToGoID -= directionOffset;
    }
  }
  else {
    squareToGoID += directionOffset;
    while (squareToGoID < kingID) {
      path.push(squareToGoID);
      squareToGoID += directionOffset;
    }
  }
  return path;
}

// discard pawns and a king as blocking candidates
// pawns cannot "block" at empty square by typical diagonal attack 
// king cannot block an attack on itself
function deleteFalseBlockers(blockersArray) {
  for (let i = blockersArray.length - 1; i >= 0; i--) {
    if (["p", "k"].includes(boardArray[blockersArray[i]][0])) {
      blockersArray.splice(i, 1); // remove the element at index i
    }
  }
}

// adds possible pawn blockers
function addCorrectPawnBlockers(squareOnPathID, blockersArray) {
  // console.log("adding correct blocker pawns to the square number: "+ squareOnPathID);
  if (whiteMove) {
    if (boardArray[squareOnPathID][3] == 4 && boardArray[squareOnPathID + 16][0] == "p" 
      && boardArray[squareOnPathID + 16][1] == "w" && boardArray[squareOnPathID + 8][0] == "e") {
        blockersArray.push(squareOnPathID + 16);
    }
    else if (![1, 2].includes(boardArray[squareOnPathID][3]) && boardArray[squareOnPathID + 8][0] == "p" && boardArray[squareOnPathID + 8][1] == "w") {
      blockersArray.push(squareOnPathID + 8);
    }
  }  
  else {
    if (boardArray[squareOnPathID][3] == 4 && boardArray[squareOnPathID - 16][0] == "p" 
      && boardArray[squareOnPathID - 16][1] == "b" && boardArray[squareOnPathID - 8][0] == "e") {
        blockersArray.push(squareOnPathID - 16);
    }
    else if (![7, 8].includes(boardArray[squareOnPathID][3]) && boardArray[squareOnPathID - 8][0] == "p" && boardArray[squareOnPathID - 8][1] == "b") {
      blockersArray.push(squareOnPathID - 8);
    }
  } 
    // executing en passant is not a way to block a check, diagonal check would already have to be there and
    // horizontal (discovered by en passant) check can only happen on 2nd or 7th rank! but then is NOT blockable 
    // by taking en passant
}



/////////////////////////////////////////////////////////////////////////////////////

// STALEMATE LOGIC FUNCTIONS:

function isStalemate() {
  let playersColor = whiteMove? "w" : "b";
  for (let i=1; i<65; i++) {
    if (boardArray[i][1] == playersColor) {
      console.log("..............exploring piece at ID: " + i);
      if (canPieceMove(i, boardArray[i][0])) {
        console.log("piece at: " + i + " can move, color of the piece: " + playersColor);
        return false;}
    }
  }
  console.log("Game ended by stalemate.")
  return true;
}

function canPieceMove(pieceID, pieceShortcut) {
  let possibleSquares;
  switch (pieceShortcut) {
    case "b":
      possibleSquares = getDiagonalSquares(pieceID);
      console.log("checking for posibility to move the bishop");
      break;
    case "r":
      possibleSquares = getHorVerSquares(pieceID);
      console.log("checking for posibility to move the rook");
      break;
    case "n":
      possibleSquares = getKnightSquares(pieceID);
      console.log("checking for posibility to move the knight");
      break;
    case "k":
    case "q":
      possibleSquares = getDiagonalSquares(pieceID).concat(getHorVerSquares(pieceID));
      console.log("checking for posibility to move the queen or king");
      break;
    case "p":
      // diagonal takes squares and vertical advance to empty squares
      possibleSquares = getDiagonalSquares(pieceID, whiteMove? 1 : 2).concat(getPawnSquares(pieceID));
      console.log("my Array" + possibleSquares);
      if (!possibleSquares.length) {console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");} 
      if (!possibleSquares.length && enPassantInProgress && pawnsAbleToEnPassant.includes(String(pieceID))) {
        console.log("inside the weird condition");
        return simulateMove(Number(pawnInEnPassant[0]) + (whiteMove? -8 : 8), pieceID, true);
      }
      console.log("checking for posibility to move the pawn");
      break;
    default:
      console.log("unknown piece");
      return false;
  }
  console.log("squares to move a piece: " + possibleSquares);
  if (pieceShortcut == "k") {return possibleSquares.some(square => simulateKingMove(square, pieceID))}
  return possibleSquares.some(square => simulateMove(square, pieceID));
}

// returns an array of neighbouring diagonal squares that are on the board
// directions: 0 -> all diagonal directions, 1 -> up the board (white pawn), 2 -> down the board (black pawn)
function getDiagonalSquares(squareID, directions = 0) {
  let squareArray = [];
  if ([0,1].includes(directions)) {
    if (areSquaresDiagonal(squareID, squareID - 9)) {squareArray.push(squareID - 9)};
    if (areSquaresDiagonal(squareID, squareID - 7)) {squareArray.push(squareID - 7)};
  }
  if ([0,2].includes(directions)) {
    if (areSquaresDiagonal(squareID, squareID + 9)) {squareArray.push(squareID + 9)};
    if (areSquaresDiagonal(squareID, squareID + 7)) {squareArray.push(squareID + 7)};
  }
  // keep those ID's that include opponent's piece (diagonal take of the pawn)
  if ([1, 2].includes(directions)) {squareArray = squareArray.filter(isOpponentsPiece);}
  console.log("diagonal square array: " + squareArray);
  return squareArray;
}

// returns an array of neighbouring horizontal or vertical squares that are on the board
function getHorVerSquares(squareID) {
  let squareArray = [];
for (let offset of [-1, 1, -8, +8]) {
    if (areSquaresRookKnight(squareID, squareID - offset)) {squareArray.push(squareID - offset)};
  }
  console.log("hor ver square array: " + squareArray);
  return squareArray;
}

// returns an array of neighbouring horizontal or vertical squares that are on the board
function getKnightSquares(squareID) {
  let squareArray = [];
for (let offset of [-17, 17, -15, 15, -10, 10, -6, 6]) {
    if (areSquaresRookKnight(squareID, squareID - offset)) {squareArray.push(squareID - offset)};
  }
  console.log("square array: " + squareArray);
  return squareArray;
}

function getPawnSquares(squareID) {
  let squareArray = [];
  let offset = whiteMove? -8 : 8;
  let startRank = whiteMove? 2 : 7;

  if ([1, 8].includes(boardArray[squareID][3])) {return squareArray;}
  if (boardArray[squareID][3] == startRank && isEmptySquare(squareID + offset) && isEmptySquare(squareID + 2*offset)) 
    {squareArray.push(squareID + 2*offset)};
  if (isEmptySquare(squareID + offset)) {squareArray.push(squareID + offset);}
  console.log("square array: " + squareArray);
  return squareArray;
}
/////////////////////////////////////////////////////////////////////////////////////

// helper functions for validity of moves / potential moves

// returns true if two given square ID's are on a diagonal and are not possesed by player's own piece
function  areSquaresDiagonal(squareID, exploredSquareID) {
  return (isSquareOnBoard(exploredSquareID) 
  && isSameSquareColor(document.getElementById(squareID), document.getElementById(exploredSquareID))
  && !isPlayersTurnAndPiece(exploredSquareID));
}

// returns true if two given square ID's are neighbouring horizontal or vertical squares
// and are not possesed by the player's own piece
function  areSquaresRookKnight(squareID, exploredSquareID) {
  return (isSquareOnBoard(exploredSquareID) 
  && !isSameSquareColor(document.getElementById(squareID), document.getElementById(exploredSquareID))
  && !isPlayersTurnAndPiece(exploredSquareID));
}
/////////////////////////////////////////////////////////////////////////////////////

// INSUFICIENCY OF MATERIAL LOGIC

function isInsuficientDraw() {
  let piecesArray = getPiecesArray();
  
  let noOfWhitePieces = piecesArray[0].length;
  let noOfBlackPieces = piecesArray[1].length;

  console.log(noOfWhitePieces);
  console.log(noOfBlackPieces);
  
  
  if (noOfWhitePieces < 4 && noOfBlackPieces < 4) {
    console.log("DRAW??? Both players have less than 4 pieces.")
    if (noOfWhitePieces == 1) {
      if (noOfBlackPieces == 1) {
        console.log("Draw by insuficient material: KING vs KING.");
        return true;
      }
      else if (noOfBlackPieces == 2) {
        if (piecesArray[1].includes("b")) {
          console.log("Draw by insuficient material: KING vs KING + BISHOP.");
          return true;
        }
        else if (piecesArray[1].includes("n")) {
          console.log("Draw by insuficient material: KING vs KING + KNIGHT.");
          return true;
        }
      }
      // noOfBlackPieces = 3:
      else {
        let withoutKnights = piecesArray[1].filter(value => value !== "n");
        if (withoutKnights.length == 1) {
          console.log("Draw by insuficient material: KING vs KING + KNIGHT + KNIGHT.");
          return true;
        } 
      }
    }
    else if (noOfWhitePieces == 2) {
      if (noOfBlackPieces == 1) {
          if (piecesArray[0].includes("b")) {
            "Draw by insuficient material: KING + BISHOP vs KING."
            return true;
          }
          else if (piecesArray[0].includes("n")) {
            console.log("Draw by insuficient material: KING + KNIGHT vs KING.");
            return true;
          }
        }
      else if (noOfBlackPieces == 2) {
        if ((piecesArray[0].includes("b") || piecesArray[0].includes("n"))
          && (piecesArray[1].includes("b") || piecesArray[1].includes("n"))) {
            console.log("Draw by insuficient material: KING + KNIGHT/BISHOP vs KING + KNIGHT/BISHOP.");
            return true;
        }
      }
    }
    // noOfWhitePieces = 3:
    else if (noOfBlackPieces == 1) {
      withoutKnights = piecesArray[0].filter(value => value !== "n");
      if (withoutKnights.length == 1) {
        console.log("Draw by insuficient material: KING + KNIGHT + KNIGHT vs KING.");
        return true;
      } 
    }
    console.log("This is NOT a draw by insuficient material.")
    return false;
  }
  else {
    console.log("This is not a draw - at least one of the players has more than 3 pieces.");
    return false;
  }
}

function getPiecesArray() {
  let piecesArray = [[],[]]
  for (let i=1; i<65; i++) {
    if (boardArray[i][1] == "w") {
      piecesArray[0].push(boardArray[i][0]);
    }
    else if (boardArray[i][1] == "b") {
      piecesArray[1].push(boardArray[i][0]);
    }
  }
  console.log("-------these are the pieces on the board:");
  console.log(piecesArray);
  return piecesArray;
}
/////////////////////////////////////////////////////////////////////////////////////

// functions to inform player about move history and additional info about moves (promotion, en passant...)
// in the infobox and moveBox divs

// return a string with colour and piece ("white rook")
function pieceToString(square) {
  let recognizedPiece = "";
  let pieceColor = boardArray[square.id][1];
  let pieceShortcut = boardArray[square.id][0];
  
  
  // is piece black or white?
  switch (pieceColor) {
    case "w": 
      recognizedPiece = "white ";
      break;
    case "b": 
      recognizedPiece = "black ";
      break;
    default: recognizedPiece = "error";  
  }
  
  // figure out what piece it is
  switch (pieceShortcut) {
    case "p": 
      recognizedPiece += "pawn";
      break;
    case "r": 
      recognizedPiece += "rook";
      break;
    case "n": 
      recognizedPiece += "knight";
      break;
    case "b": 
      recognizedPiece += "bishop";
      break;
    case "q": 
      recognizedPiece += "queen";
      break;
    case "k": 
      recognizedPiece += "king";
      break;
    default: recognizedPiece = "error"; 
  }

  return recognizedPiece;
}

// converts square ID to actual chess board coordinates (1 => a8, 64 => h1, ...)
function coordinatesOfSquare(squareID) {
  return (boardArray[squareID][2] + boardArray[squareID][3]);
}

// outputs message for players to the infobox
function outputToInfobox(infoMessage) {
  infobox.innerHTML = infoMessage;
}

function outputToMoveBox(newSquare) {
  if (whiteMove) {
    moveBox.innerHTML += moveNumber + ". ";
    moveBox.innerHTML += boardArray[newSquare.id][1] + boardArray[newSquare.id][0] + " " 
    + coordinatesOfSquare(newSquare.id);
  }
  else {
    moveBox.innerHTML += "   ||   " + boardArray[newSquare.id][1] + boardArray[newSquare.id][0] + " " 
    + coordinatesOfSquare(newSquare.id) + "<br>";
  }
}

/////////////////////////////////////////////////////////////////////////////////////


// sets up the chessboard by placing the pieces in their correct STARTING position
function setUpBoard() {
  for (let i = 1; i<17; i++) {
    let pieceName = boardArray[i][0] + boardArray[i][1];
    placePiece(document.getElementById(i), pieceName);
  }
  for (let i = 49; i<65; i++) {
    let pieceName = boardArray[i][0] + boardArray[i][1];
    placePiece(document.getElementById(i), pieceName);
  }
}

// starts the move by setting moveInProgress to true, highlights the given square and saves the square as chosenSquare 
function markPossibleMove(square) {
  //console.log("There is this piece on the square: " + square.firstChild.className);
  console.log(pieceToString(square));
  moveInProgress = true;
  highlightSquare(square);
  chosenSquare = square;
}

// executes the move of a piece from given oldSquare to newSquare
// updates the board state in boardArray
// switches the turn to the other player (in whiteMove)
function executeMove(oldSquare, newSquare) {
  
  // moves the piece to the new square (visually)
  placePiece(newSquare, (boardArray[newSquare.id][0] +  boardArray[newSquare.id][1]));

  // cleans up after the move
  clearSquare(oldSquare);
  removePiece(oldSquare);
  
  // inform the players about the move made
  outputToInfobox(pieceToString(newSquare) + " moved to " + coordinatesOfSquare(newSquare.id))

  // log a move in the move history box
  outputToMoveBox(newSquare);

  // a piece that previously stepped in en passant is being taken en passant
  if (enPassantExecutionStarted) {
    removePiece(document.getElementById(pawnInEnPassant[0]));
  }

  // pawn moved into en passant situation
  if (activateEnPassant) {
    enPassantInProgress = true;
    activateEnPassant = false;
    console.log("pawn in en passant: " + pawnInEnPassant + ", pawns able to en passant: " + pawnsAbleToEnPassant);
    console.log("enPassantInProgress=true, activateEnPassant=false");
  }
  // reseting en passant after it was or was not executed
  else if (enPassantInProgress) {
    enPassantInProgress = false;
    pawnInEnPassant = [];
    pawnsAbleToEnPassant = [];
    enPassantExecutionStarted = false;
    console.log("reseting en passant");
  }
  

  // disable castling ability of white/black after a king moved
  if (boardArray[newSquare.id][0] == "k") {
    whiteMove? disableCastlingWhite() : disableCastlingBlack();
  }

  // disable specific castling when a rook first moves or is taken on its home square
  if (abilityToCastle.whiteA && (oldSquare.id == 57 || newSquare.id == 57)) {
  abilityToCastle.whiteA = false;
  }
  if (abilityToCastle.whiteH && (oldSquare.id == 64 || newSquare.id == 64)) {
    abilityToCastle.whiteH = false;
  }
  if (abilityToCastle.blackA&& (oldSquare.id == 1 || newSquare.id == 1)) {
    abilityToCastle.blackA = false;
  }
  if (abilityToCastle.blackH && (oldSquare.id == 8 || newSquare.id == 8)) {
    abilityToCastle.blackH = false;}


  // player's king cannot be in check after any move...
  whiteMove? whiteInCheck = false : blackInCheck = false; 

  // pawn promotion logic:
  if (isPawnPromotion(newSquare)) {
    promotePawn(newSquare);
  }
  else {
    switchMove();
  }
}


function switchMove() {

  // toggling white/black player move
  whiteMove = !whiteMove; 
  if (!whiteMove) {moveNumber++;} 
  
  // switch the colour banners for making the players know who's move it is
  let wBanner = document.getElementById("whiteBanner");
  let bBanner = document.getElementById("blackBanner");
  bBanner.classList.toggle("hideBanner");
  wBanner.classList.toggle("hideBanner");


  // after a move was switched:
  let kingsColor = whiteMove ? "White" : "Black";
  let squareOfInterest = whiteMove? whiteKingID : blackKingID;
  let attackerSquares = getAttackersOfSquare(squareOfInterest);
  // if there is a multiple check, king has to be able to move or it's checkmate
  if (attackerSquares.length > 1) {
    // double check
    console.log(kingsColor + " king is being checked on square: " + squareOfInterest + " from squares: " + attackerSquares);
    whiteMove ? whiteInCheck = true : blackInCheck = true;
    if (!canKingMove()) {
      console.log(">=>=>=>=> " + kingsColor + " player has been checkmated. <=<=<=<=<");
      toggleClicking();
    }
  }
  // when it's a single check, player has to be able to do one of three things:
  // move king to a save (non-checked) square
  // take the attacker
  // block the attack
  // if non of the above applies it's checkmate
  else if (attackerSquares.length) {
    // single check
    console.log(kingsColor + " king is being checked on square: " + squareOfInterest + " from square: " + attackerSquares);
    whiteMove ? whiteInCheck = true : blackInCheck = true;
    if (isCheckmate(attackerSquares[0])) {
      console.log(">=>=>=>=> " + kingsColor + " player has been checkmated. <=<=<=<=<");
      toggleClicking();
    }
  }
  else {
    console.log(kingsColor + " king is NOT in check");
    console.log("checking for a stalemate");
    if (isStalemate()) {console.log(">=>=>=>=> The game has ended by a stalemate. <=<=<=<=<");}
    else {isInsuficientDraw();}
  }
  //console.log("white king is on square: " + whiteKingID);
  //console.log("black king is on square: " + blackKingID);
}



// call the function to initially set up the board
setUpBoard();


  // // todo:
  // make an updateboardArray function??????
  // are funtions isDiagonal() and isDiagonalNeighbour() even ever used??????
  // add functions for ending the game by different ways (checkmate, stalemate, draw ... which announce that and toggleClicking())
  // simplify getAttackersOfSquare() function
  // put some often used expressions into a function (like for checking validity of the diagonal squares:
  // on board && same color of the square && ....
  // simplify canKingMove()
  // simplify getKingToAttackerPath() and getPathArray()

