///////////////////////////////////////////
//   chess board in HTML/CSS/JavaScript  //
///////////////////////////////////////////

//        to do:  
//        move a pawn properly
//        move counter or even notation (also show next to the board)


let colorCounter = 1;
let board = document.getElementById("board");
let whiteMove = true;         // true => white's move, false => black's move

let infobox = document.getElementById("infobox");



// not used yet:
// let whiteInCheck = false;    // if true => check or checkmate happening
// let blackInCheck = false;
// validMoves = [];

let moveInProgress = false;
let chosenSquare = null;



// array or arrays with empty member on index 0
// 64 squares represented as ['r', 'b', 'a', 8] (piece, color, File, file), indexes 0 and 1 possibly "e" for empty square
let boardRepresentation = [
  [],
  ['r', 'b', 'a', 8], ['n', 'b', 'b', 8], ['b', 'b', 'c', 8], ['q', 'b', 'd', 8], ['k', 'b', 'e', 8], ['b', 'b', 'f', 8], ['n', 'b', 'g', 8], ['r', 'b', 'h', 8],
  ['p', 'b', 'a', 7], ['p', 'b', 'b', 7], ['p', 'b', 'c', 7], ['p', 'b', 'd', 7], ['p', 'b', 'e', 7], ['p', 'b', 'f', 7], ['p', 'b', 'g', 7], ['p', 'b', 'h', 7], 
  ['e', 'e', 'a', 6], ['e', 'e', 'b', 6], ['e', 'e', 'c', 6], ['e', 'e', 'd', 6], ['e', 'e', 'e', 6], ['e', 'e', 'f', 6], ['e', 'e', 'g', 6], ['e', 'e', 'h', 6],
  ['e', 'e', 'a', 5], ['e', 'e', 'b', 5], ['e', 'e', 'c', 5], ['e', 'e', 'd', 5], ['e', 'e', 'e', 5], ['e', 'e', 'f', 5], ['e', 'e', 'g', 5], ['e', 'e', 'h', 5],
  ['e', 'e', 'a', 4], ['e', 'e', 'b', 4], ['e', 'e', 'c', 4], ['e', 'e', 'd', 4], ['e', 'e', 'e', 4], ['e', 'e', 'f', 4], ['e', 'e', 'g', 4], ['e', 'e', 'h', 4],
  ['e', 'e', 'a', 3], ['e', 'e', 'b', 3], ['e', 'e', 'c', 3], ['e', 'e', 'd', 3], ['e', 'e', 'e', 3], ['e', 'e', 'f', 3], ['e', 'e', 'g', 3], ['e', 'e', 'h', 3],
  ['p', 'w', 'a', 2], ['p', 'w', 'b', 2], ['p', 'w', 'c', 2], ['p', 'w', 'd', 2], ['p', 'w', 'e', 2], ['p', 'w', 'f', 2], ['p', 'w', 'g', 2], ['p', 'w', 'h', 2],
  ['r', 'w', 'a', 1], ['n', 'w', 'b', 1], ['b', 'w', 'c', 1], ['q', 'w', 'd', 1], ['k', 'w', 'e', 1], ['b', 'w', 'f', 1], ['n', 'w', 'g', 1], ['r', 'w', 'h', 1]
 ]

// create the board and add click ability to the squares
for(let i = 0; i<64; i++) {
  let thisSquare = document.createElement("div");
  thisSquare.id = i+1;
  thisSquare.addEventListener("click", function() {

    //console.log("this is a square number: " + thisSquare.id);
    if (!moveInProgress && isPlayersTurnAndPiece(thisSquare)) {
      // user selected a piece to move (there was no other piece selected before)
      markPossibleMove(thisSquare); 
    }
    else if (moveInProgress && thisSquare == chosenSquare) {
      // same piece clicked twice ==> highlight/unhighlight ==> move in progress canceled 
      clearSquare(chosenSquare);
    }
    else if (isPlayersTurnAndPiece(thisSquare)) {
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
function isPlayersTurnAndPiece(square) {
  if (boardRepresentation[square.id][1] == "w" && whiteMove) {
    return true;
  }
  else if (boardRepresentation[square.id][1] == "b" && !whiteMove) {
    return true;
  }
  else {return false}
    // returns false if it's not player's move or if the clicked square is empty
}

function isEmptySquare(squareID) {
  return (boardRepresentation[squareID][0] == "e");
}

function isOpponentsPiece(squareID) {
  return ((!whiteMove && boardRepresentation[squareID][1] == "w") || (whiteMove && boardRepresentation[squareID][1] == "b"));
}

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

// function findValidMoves(square) {
//   return validMoves;
// }

// converts square ID to actual chess board coordinates (1 => a8, 64 => h1, ...)
function coordinatesOfSquare(squareID) {
  return (boardRepresentation[squareID][2] + boardRepresentation[squareID][3]);
}

// outputs message for players to the infobox
function outputToInfobox(infoMessage) {
  infobox.innerHTML = infoMessage;
}

function isValidMove(square) {
  let pieceSchortcut = boardRepresentation[chosenSquare.id][0];
  console.log(pieceSchortcut);
  switch (pieceSchortcut) {
    case "p": 
        if (boardRepresentation[chosenSquare.id][1] == "w") 
          {return isWhitePawnMove(square)}
        else {return isBlackPawnMove(square)}
    case "r":
      return isRookMove(square); 
    case "n": 
      return isKnightMove(square);
    case "b": 
      return isBishopMove(square);
    case "q": 
      return isQueenMove(square);
    case "k": 
      return isKingMove(square);  
  }
}

function isWhitePawnMove(square) {
  console.log("hi from white pawn move logic");
  if (!isSameFile(square.id)) {
    if ((isDiagonalNeighbour(square, 0) || isDiagonalNeighbour(square, 1)) && isOpponentsPiece(square.id)) {
    return true;
    } 
  }
  // initial 2 square move of a pawn
  //let blaSquare = document.getElementById(chosenSquare.id -8);
  else {
    if ((boardRepresentation[chosenSquare.id][3] == 2) && 
    (boardRepresentation[square.id][3] == 4) && isEmptySquare(chosenSquare.id - 8) && 
    isEmptySquare(square.id)) {
      return true;
    }
    else if (boardRepresentation[square.id][3] == (boardRepresentation[chosenSquare.id][3] + 1 )) {
      return true;
    }
  }
}

function isBlackPawnMove(square) {
  console.log("hi from black pawn move logic");
  if (!isSameFile(square.id)) {
    if ((isDiagonalNeighbour(square, 2) || isDiagonalNeighbour(square, 3)) && isOpponentsPiece(square.id)) {
    return true;
    } 
  }
  // initial 2 square move of a pawn
  
  else {
    if ((boardRepresentation[chosenSquare.id][3] == 7) && 
    (boardRepresentation[square.id][3] == 5) && isEmptySquare(Number(chosenSquare.id) + 8) && 
    isEmptySquare(square.id)) {
      return true;
    }
    else if (boardRepresentation[square.id][3] == (boardRepresentation[chosenSquare.id][3] - 1 )) {
      return true;
    }
  }
}

function isRookMove(square) {
  console.log("hi from rook move logic");
  if ((!isSameFile(square.id)) && (!isSameRank(square.id))) {
    return false;
  }
  else {
    return isHorizontalOrVerticalPath(square, getHorizontalOrVerticalDirection(square.id));
  }  
}

function isKnightMove(square) {
  console.log("hi from knight move logic");
  return true;
}


// Object.is(0, -0) will give false, but 0==-0 will give true

function isBishopMove(square) {
  return isDiagonalPath(square, getDiagonalDirection(square.id));
}

function isQueenMove(square) {
  console.log("hi from queen move logic");
  return true;
}

function isKingMove(square) {
  console.log("hi from king move logic");
  return true;
}

/////////////////////////////////////////////////

function isSameRank(squareID) {
  return (boardRepresentation[chosenSquare.id][3] == boardRepresentation[squareID][3]); 
}

function isSameFile(squareID) {
  return (boardRepresentation[chosenSquare.id][2] == boardRepresentation[squareID][2]); 
}

function isSameSquareColor(square) {
  return (square.classList.contains("blackSquare") && chosenSquare.classList.contains("blackSquare"))
  || (square.classList.contains("whiteSquare") && chosenSquare.classList.contains("whiteSquare")); 
}

function isAFile() {
  return (boardRepresentation[chosenSquare.id][2] == "a"); 
}

function isHFile() {
  return (boardRepresentation[chosenSquare.id][2] == "h"); 
}

function isFirstRank() {
  return (boardRepresentation[chosenSquare.id][3] == 1); 
}

function isEighthRank() {
  return (boardRepresentation[chosenSquare.id][3] == 8); 
}

// not used???
function isDiagonal(square) {
  let differenceOfSquareID = square.id - chosenSquare.id;
  console.log(differenceOfSquareID);
  if (differenceOfSquareID % 9 == 0 || differenceOfSquareID % 7 == 0) {
    return true;
  }
}

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

function getDiagonalDirection(squareID) {
  let directionHelper = squareID - chosenSquare.id;
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
      console.log("error");
  }
}

function isDiagonalPath(endSquare, direction) {
  
  // checking for same color of start and ending square
  // for situation where %7 allows to move to wrong placec (they are of different square color)
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

function getHorizontalOrVerticalDirection(squareID) {
  let directionHelper = squareID - chosenSquare.id;
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
      console.log("error");
  }
}

function isHorizontalOrVerticalPath(endSquare, direction) {
  console.log("hi from path vertical or horizontal");
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


// return a string with colour and piece ("white rook")
function pieceToString(square) {
  let recognizedPiece = "";
  let pieceColor = boardRepresentation[square.id][1];
  let pieceSchortcut = boardRepresentation[square.id][0];
  
  
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
  switch (pieceSchortcut) {
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
      recognizedPiece += "King";
      break;
    default: recognizedPiece = "error"; 
  }

  return recognizedPiece;
}

// sets up the chessboard by placing the pieces in their correct starting positions
function setUpBoard() {
  for (let i = 1; i<17; i++) {
    let pieceName = boardRepresentation[i][0] + boardRepresentation[i][1];
    placePiece(document.getElementById(i), pieceName);
  }
  for (let i = 49; i<65; i++) {
    let pieceName = boardRepresentation[i][0] + boardRepresentation[i][1];
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
// updates the board state in boardRepresentation
// switches the turn to the other player (in whiteMove)
function executeMove(oldSquare, newSquare) {
  // updates boardRepresentation array
  console.log("executing move");
  
  // moves the piece to the new square
  placePiece(newSquare, (boardRepresentation[oldSquare.id][0] +  boardRepresentation[oldSquare.id][1]));

  // make an updateboardRepresentation function?????? : 
  // updates the boardRepresentation array
  boardRepresentation[newSquare.id][0] = boardRepresentation[oldSquare.id][0]; 
  boardRepresentation[oldSquare.id][0] = "e";
  boardRepresentation[newSquare.id][1] = boardRepresentation[oldSquare.id][1]; 
  boardRepresentation[oldSquare.id][1] = "e";
  
  
  
  // cleans up after the move
  clearSquare(oldSquare);
  removePiece(oldSquare);
  whiteMove = !whiteMove;  // toggling white/black player move
  
  // switch the colour banners for making the players know who's move it is
  let wBanner = document.getElementById("whiteBanner");
  let bBanner = document.getElementById("blackBanner");
  bBanner.classList.toggle("hideBanner");
  wBanner.classList.toggle("hideBanner");
  console.log(pieceToString(newSquare));
  console.log(coordinatesOfSquare(newSquare.id));

  outputToInfobox(pieceToString(newSquare) + " moved to " + coordinatesOfSquare(newSquare.id))
}

// call the function to initially set up the board
setUpBoard();