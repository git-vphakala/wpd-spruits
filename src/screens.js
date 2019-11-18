import { Card } from './Card.js';
import { RadioGroup } from './RadioGroup.js';
import { Game } from './Game.js';

export const screens = {
  "init":function Init(args={}, store = {}) {
    args.screen = {
      create:function(entity, store) {
	const {controller} = store;
	let numPairs = { "Easy":4, "Medium":6, "Hard":8 },
	    level = new RadioGroup({ fieldName:"Select level", buttonNames:Object.keys(numPairs) }),
	    
	    handleClickStart = function(e) {
	      let size = numPairs[ level.get("val") ];
	      e.preventDefault();
	
	      if (size) {
		store.gameNumPairs = size;
		controller();
	      }
	    };
	
	entity.$field.append(level.$field, $("<button>").html("Play").on("click", handleClickStart));
	entity.$label.css({ display:"none" });
      }
    };
    
    spruits.Entity.call(this, args);
    this.load(store);
  }, // init
  
  "play":function Play(args={}, store={}) {
    let game;
    
    args.screen = {
      create:function(entity, store) {
	const {controller, gameNumPairs} = store;
	game = new Game({ numOfPairs: gameNumPairs, onGameOver:() => controller() });
	
	/* shuffleCards returns an array which contains the fieldNames of the cards in a random order. 
	 * Cards are created, stored to fields-property and placed to the board in the random order by the Array.map-method.
	 */
	entity.$field.append( game.shuffleCards().map(cardName => {
	  entity.createField(cardName, Card, { faceValue:cardName.slice(0, -1), attrs:{ label:{ class:"facedown" }}, onClick:game.play });
	  return entity.fields[cardName].$field;
	}));
      }}; // create, screen
	  
    spruits.Entity.call(this, args);
    this.$label.css({ display:"none" });
    this.load(store);
  }, // play

  "gameover":function Gameover(args={}, store={}) {
    args.screen = {
      create:function(entity, store) {
	const {controller} = store;
	let handleClickReplay = function(e, entity) {
	  e.preventDefault();
	  controller();
	};
	
	entity.$field.append("Game over. ",  $("<button>").html("Replay").on("click", e => handleClickReplay(e, this)));
	entity.$label.css({ display:"none" });
      },
    };

    spruits.Entity.call(this, args);
    this.load(store);
  }, // gameover

  "FindPairs":{
    create:function(entity, store) {
      const { controller } = store;
      let $board = $("<div>", { class:"board" });
      
      entity.$field.addClass("findpairs-4").append($board);
      store.$board = $board;
      controller();
    },
    update:function(entity, store) {
      const { States, stateToRender, $board } = store;

      const screenName = spruits.getKeyByValue(States, stateToRender);
      if (screenName === undefined) {
	console.log("ERR:invalidState,stateToRender=" + stateToRender + ", States=" + JSON.stringify(States));
	return;
      }

      $board.empty();
      entity.createField(screenName, screens[screenName], {insertLabel:false}, store);
      $board.append(entity.fields[screenName].$field);
    }
  }, // FindPairs
}
