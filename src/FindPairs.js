import { Game } from './Game.js';
import { screens } from './screens.js';

export function FindPairs(args = {attrs:{label:{style:"display:none"}}}) {
  let controller, store, state, States;

  States = { init:1, play:2, gameover:3 };
  
  args.screen = screens["FindPairs"];
  
  controller = function() {
    if (state === undefined) store.stateToRender = States.init;
    else if (state === States.init) store.stateToRender = States.play;
    else if (state === States.play) store.stateToRender = States.gameover;
    else if (state === States.gameover) store.stateToRender = States.init;
    else {
      console.log("ERR:controller:invalid state, state=" + state);
      return;
    }
    state = store.stateToRender;
    this.refresh(store);
  }.bind(this);

  store = { controller:controller, States:States };
  spruits.Entity.call(this, args);
  this.load(store);
} // FindPairs

export const findPairsCssRules = `.spruit-field.findpairs-4 .board {
  background-color: #9ACD32;
  margin: 1em;
  padding:1em;
}
.spruit-field.findpairs-4 .board button {
  background: #ffff00;
  color: #333300;
}`;
