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


// let boardSituation = [
//                       [],     // index 0 is empty to have same numbers as ID's and in this array
//                       ["r", "b"], ["n", "b"], ["b", "b"], ["q", "b"], ["k", "b"], ["b", "b"], ["n", "b"], ["r", "b"], 
//                       ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"],
//                       ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], 
//                       ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
//                       ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
//                       ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
//                       ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], 
//                       ["r", "w"], ["n", "w"], ["b", "w"], ["q", "w"], ["k", "w"], ["b", "w"], ["n", "w"], ["r", "w"]
//                     ];


// const boardCoordinates = [
//                           [],   // zero member is not used
//                           ["a", 8], ["b", 8], ["c", 8], ["d", 8], ["e", 8], ["f", 8], ["g", 8], ["h", 8],
//                           ["a", 7], ["b", 7], ["c", 7], ["d", 7], ["e", 7], ["f", 7], ["g", 7], ["h", 7],
//                           ["a", 6], ["b", 6], ["c", 6], ["d", 6], ["e", 6], ["f", 6], ["g", 6], ["h", 6],
//                           ["a", 5], ["b", 5], ["c", 5], ["d", 5], ["e", 5], ["f", 5], ["g", 5], ["h", 5],
//                           ["a", 4], ["b", 4], ["c", 4], ["d", 4], ["e", 4], ["f", 4], ["g", 4], ["h", 4],
//                           ["a", 3], ["b", 3], ["c", 3], ["d", 3], ["e", 3], ["f", 3], ["g", 3], ["h", 3],
//                           ["a", 2], ["b", 2], ["c", 2], ["d", 2], ["e", 2], ["f", 2], ["g", 2], ["h", 2],
//                           ["a", 1], ["b", 1], ["c", 1], ["d", 1], ["e", 1], ["f", 1], ["g", 1], ["h", 1]
//                           ];


// array or arrays with empty member on index 0
// 64 squares represented as ['r', 'b', 'a', 8] (piece, color, rank, file), indexes 0 and 1 possibly "e" for empty square
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
    else if (!moveInProgress && isOpponentsPiece(thisSquare)) {
      // player clicked an opponent's piece instead of his piece
      console.log("It is not this colour's move!");
    }
    else if (isOpponentsPiece(thisSquare)) {
      // a square is highlighted and player clicked opponent's piece ==> if valid, a take happening
      // if (validSquares.includes(thisSquare))  {
      
      if (isValidMove(thisSquare)) {
        takePiece(chosenSquare, thisSquare);
      }
      console.log("Taking opponent's piece.");
      // }
    }
    else if (isEmptySquare(thisSquare.id)) {
      // a square is hightlighted and player clicked empty square ==> if valid, a move happening
      if (isValidMove(thisSquare))  {
        executeMove(chosenSquare, thisSquare);
        console.log("moving to an empty square");
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
  // new rank of squares (adding <br>)
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
  else {
    // returns false if it's not player's move or if the clicked square is empty
    return false;
  }
}

function isEmptySquare(squareID) {
  if (boardRepresentation[squareID][0] == "e") {
    return true;
  }
}

function isOpponentsPiece(square) {
  if ((!whiteMove && boardRepresentation[square.id][1] == "w") || (whiteMove && boardRepresentation[square.id][1] == "b")) {
    return true;  
  }
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
        if (boardRepresentation[chosenSquare.id][1] == "w") {return isWhitePawnMove(square)}
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

  if (!isSameColumn(square) && (isDiagonal(square, 0) || isDiagonal(square, 1)) && isOpponentsPiece(square)) {
    return true;
  } 
  // initial 2 square move of a pawn
  else if ((boardRepresentation[chosenSquare.id][3] == 2) && (boardRepresentation[square.id][3] == 4) && 
    isEmptySquare(chosenSquare.id - 8) && isEmptySquare(chosenSquare.id - 16)) {
    return true;
  }
  else if ((boardRepresentation[square.id][3] == (boardRepresentation[chosenSquare.id][3] + 1 ))) {
    return true;
  }
}

function isBlackPawnMove(square) {
  console.log("hi from black pawn move logic");
  return true;
}

function isRookMove(square) {
  console.log("hi from rook move logic");
  return true;
}

function isKnightMove(square) {
  console.log("hi from knight move logic");
  return true;
}

function isBishopMove(square) {
  console.log("hi from bishop move logic");
  return true;
}

function isQueenMove(square) {
  console.log("hi from queen move logic");
  return true;
}

function isKingMove(square) {
  console.log("hi from king move logic");
  return true;
}



function isSameColumn(square) {
  return (boardRepresentation[chosenSquare.id][2] == boardRepresentation[square.id][2]); 
}

function isAColumn() {
  return (boardRepresentation[chosenSquare.id][2] == "a"); 
}

function isHColumn() {
  return (boardRepresentation[chosenSquare.id][2] == "h"); 
}

// direction: 0 => top/left, 1 => top/right, 2 => bottom/right, 3 => bottom/left
function isDiagonal(square, direction) {
  switch(direction) {
    // top/left
    case 0:
      if (isAColumn()) {return false};
      return (square.id == chosenSquare.id - 9);
    // top/right
    case 1:
      if (isHColumn()) {return false};
      return (square.id == chosenSquare.id - 7);
    // bottom/right
    case 2:
      if (isHColumn(square)) {return false};
      return (square.id == chosenSquare.id + 9);
    // bottom/left
    case 3:
      if (isAColumn(square)) {return false};
      return (square.id == chosenSquare.id + 7);
    default:
      console.log("error");
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