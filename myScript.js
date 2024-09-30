///////////////////////////////////////////
//   chess board in HTML/CSS/JavaScript  //
///////////////////////////////////////////


//        to do:  
//        be able to take any opponent's piece (update board and array)
//        move a pawn properly
//        move counter or even notation (also show next to the board)
//        visual representation of who's move it is (next to the board as a square or strip in the right colour)

// for creating the board (and its white/black pieces)
let colorCounter = 1;
let board = document.getElementById("board");
let whiteMove = true;         // true => white's move, false => black's move

// not used for yet:
// let whiteInCheck = false;    // if true => check or checkmate happening
// let blackInCheck = false;

let moveInProgress = false;
let chosenSquare = null;
let boardSituation = [
                      [],
                      ["r", "b"], ["n", "b"], ["b", "b"], ["q", "b"], ["k", "b"], ["b", "b"], ["n", "b"], ["r", "b"], 
                      ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"], ["p", "b"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], 
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"], ["e", "e"],
                      ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], ["p", "w"], 
                      ["r", "w"], ["n", "w"], ["b", "w"], ["q", "w"], ["k", "w"], ["b", "w"], ["n", "w"], ["r", "w"]
                    ]




// create the board
for(let i = 0; i<64; i++) {
  let thisSquare = document.createElement("div");
  thisSquare.id = i+1;
  thisSquare.addEventListener("click", function() {
    console.log("this is a square number: " + thisSquare.id);
    if (!moveInProgress && isPlayersTurn(thisSquare)) {
      // user clicked the first square
      possibleMove(thisSquare); 
    }
    else if (!moveInProgress && !isPlayersTurn(thisSquare)) {
      console.log("not your turn or empty square");
    }
    else if (thisSquare == chosenSquare) {
      // move is not happening, because same square was chosen twice
      unhighlightSquare(thisSquare);
      chosenSquare = null;
      moveInProgress = false;
    }
    else {
      // user clicked a second square (after one was already highlighted/clicked before)
      executeMove(chosenSquare, thisSquare);
    }
  })
  board.appendChild(thisSquare)
  if(colorCounter%2 == 1){
    thisSquare.className = "whiteSquare";
  }
  else{
    thisSquare.className = "blackSquare"; 
  }
  if((i+1)%8 === 0) {
    let breakLine = document.createElement("br");
    board.appendChild(breakLine);
    colorCounter++;
  }
  colorCounter++;
  
}

// place a piece on the board given the square and shortcut of the piece ("bp" - black pawn)
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
function isPlayersTurn(square) {
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

// return a string with colour and piece ("white rook")
function recognizePiece(pieceShortcut) {
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
function possibleMove(square) {
  console.log("There is this piece on the square: " + square.firstChild.className);
  console.log(recognizePiece(square.firstChild.className));
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
  removePiece(oldSquare);
  moveInProgress = false;
  chosenSquare = null;
  unhighlightSquare(oldSquare);
  whiteMove = !whiteMove;  // toggling white/black player move
}

// call the function to initially set up the board
setUpBoard();