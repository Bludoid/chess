// todo:  switch between black and white player
//        be able to take any opponent's piece (update board and array)
//  move a pawn properly


let colorCounter = 1;
let board = document.getElementById("board");
let whiteMove = true;         // true => white's move, false => black's move
let whiteInCheck = false;    // if true => check or checkmate happening
let blackInCheck = false;
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

// place a piece on the board given square ID (1 to 64) and shortcut of the piece ("bp" - black pawn)
function placePiece(square, pieceName) {
  //let desiredSquare = document.getElementById(squareID);
  let newPiece = document.createElement("img");
  let pathString = "img/" + pieceName + ".png";
  newPiece.src = pathString;
  newPiece.className = pieceName;
  square.appendChild(newPiece);
}

function removePiece(square) {
  square.innerHTML = "";

}

function highlightSquare(square) {
  square.classList.add("highlighted");
}

function unhighlightSquare(square) {
  square.classList.remove("highlighted");
}

function isPlayersTurn(square) {
  if (boardSituation[square.id][1] == "w" && whiteMove) {
    return true;
  }
  else if (boardSituation[square.id][1] == "b" && !whiteMove) {
    return true;
  }
  else {
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

// movePossible() if color fits procede to clicking another piece if valid, call executeMove()

function possibleMove(square) {
  // if not check, check for validity of the desired move, if cool, call executeMove()
  console.log("There is this piece on the square: " + square.firstChild.className);
  console.log(recognizePiece(square.firstChild.className));
  moveInProgress = true;
  chosenSquare = square;
  highlightSquare(square);
}

function executeMove(oldSquare, newSquare) {
  //let pickedSquare = document.getElementById(squareID);
  console.log("executing move");
  //console.log("There is this piece on the square: " + square.firstChild.className);
  //console.log(recognizePiece(square.firstChild.className));
  boardSituation[newSquare.id][0] = boardSituation[oldSquare.id][0]; 
  boardSituation[oldSquare.id][0] = "e";
  boardSituation[newSquare.id][1] = boardSituation[oldSquare.id][1]; 
  boardSituation[oldSquare.id][1] = "e";
  placePiece(newSquare, oldSquare.firstChild.className);
  removePiece(oldSquare);
  moveInProgress = false;
  chosenSquare = null;
  unhighlightSquare(oldSquare);
  whiteMove = !whiteMove;  // toggling white/black player move
  console.log(boardSituation);
  // calls updateBoard()
}



setUpBoard();