import { FaceState } from './Card.js';

export function Game(args) {
  let
  pairList = Array(args.numOfPairs).fill(null).map((char,i) => String.fromCharCode("a".charCodeAt(0) + i)),
  faceUp = [],
  removed = 0,
  onGameOver = args.onGameOver,
    
  shuffleCards = function() {
    let numPairs = pairList.length,
	cardId = [ 1, 2 ],
	alreadySet = {},
	boardSize = 2*numPairs,
	board = Array(boardSize).fill(null),
	i;
      
    pairList.forEach(pairName => {
      cardId.forEach(id => {
	for (;;) {
	  i = Math.floor(Math.random() * boardSize); // i = integer [0 - (boardSize-1)]
	  if (alreadySet["" + i] !== true) {
	    alreadySet["" + i] = true;
	    board[i] = pairName + id;
	    break;
	  }
	} // for(;;)
      });
    });
      
    return board;
  }, // shuffleCards

  play = function(card) {
    let turned = false;
      
    if (faceUp.length < 2 && card.isFacedown()) {
      card.setFace(FaceState.Up);
      faceUp.push(card);
      turned = true;
    }
      
    if (faceUp.length > 1) {
      /* two cards are face-up */
	
      if (faceUp[0].getFacevalue() === faceUp[1].getFacevalue()) {
	/* pair found */
	faceUp.forEach(card => card.removeFromBoard());
	faceUp = [];
	removed++;
	if (removed === pairList.length) onGameOver();
      } else {
	/* not a pair */
	  
	if (turned === false) {
	  /* return cards back to the face-down state */
	  faceUp.forEach(card => card.setFace(FaceState.Down));
	  faceUp = [];
	}
      }
    }
  } // play

  this.shuffleCards = shuffleCards;
  this.play = play;

  this.setOnGameOver = function(onGameOverCallback) {
    onGameOver = onGameOverCallback;
  }
}
