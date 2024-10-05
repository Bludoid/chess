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
let boardSituation = [
                      [],     // index 0 is empty to have same numbers as ID's and in this array
                      ["r", "b"], ["n", "b"], ["b", "b"], ["q", "b"], ["k", "b"], ["b", "b"], ["n", "b"], ["r", "b"], 
                      ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], 
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], 
                      ["r", "w"], ["n", "w"], ["b", "w"], ["q", "w"], ["k", "w"], ["b", "w"], ["n", "w"], ["r", "w"]
                    ]


const boardCoordinates = [
  "", 
  "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
  "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
  "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
  "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
  "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
  "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
  "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
  "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
];

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
    else if (!moveInProgress && isEmptySquare(thisSquare)) {
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
      takePiece(chosenSquare, thisSquare);
      console.log("Taking opponent's piece.");
      // }
    }
    else if (isEmptySquare(thisSquare)) {
      // a square is hightlighted and player clicked empty square ==> if valid, a move happening
      // if (validSquares.includes(thisSquare))  {
      executeMove(chosenSquare, thisSquare);
      console.log("moving to an empty square");
      // }
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
  // new row of squares (adding <br>)
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
  newPiece.className = pieceName;
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
  if (boardSituation[square.id][1] == "w" && whiteMove) {
    return true;
  }
  else if (boardSituation[square.id][1] == "b" && !whiteMove) {
    return true;
  }
  else {
    // returns false if it's not player's move or if the clicked square is empty
    return false;
  }
}

function isEmptySquare(square) {
  if (boardSituation[square.id][0] == "e") {
    return true;
  }
}

function isOpponentsPiece(square) {
  if ((!whiteMove && boardSituation[square.id][1] == "w") || (whiteMove && boardSituation[square.id][1] == "b")) {
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
function squareToCoordinates(squareID) {
  return boardCoordinates[squareID];
}

// outputs message for players to the infobox
function outputToInfobox(infoMessage) {
  infobox.innerHTML = infoMessage;
}







// return a string with colour and piece ("white rook")
function pieceToString(pieceShortcut) {
  let recognizedPiece = "";
  
  // is piece black or white?
  switch (pieceShortcut.charAt(1)) {
    case "w": 
      recognizedPiece = "white ";
      break;
    case "b": 
      recognizedPiece = "black ";
      break;
    default: recognizedPiece = "error";  
  }
  
  // figure out what piece it is
  switch (pieceShortcut.charAt(0)) {
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
      recognizedPiece += "QUEEN";
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
    let pieceName = boardSituation[i][0] + boardSituation[i][1];
    placePiece(document.getElementById(i), pieceName);
  }
  for (let i = 49; i<65; i++) {
    let pieceName = boardSituation[i][0] + boardSituation[i][1];
    placePiece(document.getElementById(i), pieceName);
  }
}

// starts the move by setting moveInProgress to true, highlights the given square and saves the square as chosenSquare 
function markPossibleMove(square) {
  console.log("There is this piece on the square: " + square.firstChild.className);
  console.log(pieceToString(square.firstChild.className));
  moveInProgress = true;
  highlightSquare(square);
  chosenSquare = square;
}

// executes the move of a piece from given oldSquare to newSquare
// updates the board state in boardSituation
// switches the turn to the other player (in whiteMove)
function executeMove(oldSquare, newSquare) {
  // updates boardSituation array
  console.log("executing move");
  boardSituation[newSquare.id][0] = boardSituation[oldSquare.id][0]; 
  boardSituation[oldSquare.id][0] = "e";
  boardSituation[newSquare.id][1] = boardSituation[oldSquare.id][1]; 
  boardSituation[oldSquare.id][1] = "e";
  // moves the square
  placePiece(newSquare, oldSquare.firstChild.className);
  
  // cleans up after the move
  clearSquare(oldSquare);
  removePiece(oldSquare);
  whiteMove = !whiteMove;  // toggling white/black player move
  
  // switch the colour banners for making the players know who's move it is
  let wBanner = document.getElementById("whiteBanner");
  let bBanner = document.getElementById("blackBanner");
  bBanner.classList.toggle("hideBanner");
  wBanner.classList.toggle("hideBanner");
  console.log(pieceToString(newSquare.firstChild.className));
  console.log(squareToCoordinates(newSquare.firstChild.className));

  outputToInfobox(pieceToString(newSquare.firstChild.className) + " moved to " + squareToCoordinates(newSquare.id))
}

// call the function to initially set up the board
setUpBoard();