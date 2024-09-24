let colorCounter = 1;
let board = document.getElementById("board");
let whiteMove = true;         // true => white's move, false => black's move
let whiteInCheck = false;    // if true => check or checkmate happening
let blackInCheck = false;
let moveInProgress = false;
let chosenSquare = null;
let boardSituation = [
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
    // if moveInProgress
    // if (boardSituation[i+1][0] == "e") {
    //   console.log("This sqaure is empty.");
    // }
    // else if (whiteInCheck || blackInCheck) {
    //   console.log("check is happening");  
    //   // has to get out of check
    // }
    if (!moveInProgress) {
      possibleMove(thisSquare); 
    }
    else {
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
function placePiece(squareID, pieceName) {
  let desiredSquare = document.getElementById(squareID);
  let newPiece = document.createElement("img");
  let pathString = "img/" + pieceName + ".png";
  newPiece.src = pathString;
  newPiece.className = pieceName;
  desiredSquare.appendChild(newPiece);
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
    let pieceName = boardSituation[i-1][0] + boardSituation[i-1][1];
    placePiece(i, pieceName);
  }
  for (let i = 49; i<65; i++) {
    let pieceName = boardSituation[i-1][0] + boardSituation[i-1][1];
    placePiece(i, pieceName);
  }
}

// movePossible() if color fits procede to clicking another piece if valid, call executeMove()

function possibleMove(square) {
  // if not check, check for validity of the desired move, if cool, call executeMove()
  console.log("There is this piece on the square: " + square.firstChild.className);
  console.log(recognizePiece(square.firstChild.className));
  moveInProgress = true;
  chosenSquare = square;
}

function executeMove(oldSquare, newSquare) {
  //let pickedSquare = document.getElementById(squareID);
  console.log("executing move");
  //console.log("There is this piece on the square: " + square.firstChild.className);
  //console.log(recognizePiece(square.firstChild.className));
  boardSituation[newSquare.id-1][0] = boardSituation[oldSquare.id-1][0]; 
  boardSituation[oldSquare.id-1][0] = "e";
  boardSituation[newSquare.id-1][1] = boardSituation[oldSquare.id-1][1]; 
  boardSituation[oldSquare.id-1][1] = "e";
  placePiece(newSquare.id, oldSquare.firstChild.className);
  // calls updateBoard()
}

// function updateBoard(oldSquare, newSquare) {
//   move the piece on the board
//   update the boardSituation array
// }

setUpBoard();