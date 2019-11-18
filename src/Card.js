export const FaceState = { Down:0, Up:1 };

export function Card(args) {
  let faceValue = args.faceValue,
      onClick =   args.onClick,
      $label;
  
  spruits.Component.call(this, args);
  $label = this.$label;
  $label.html(faceValue);
  this.$field.addClass("card");
  
  this.$field.on("click", e => {
    e.preventDefault();
    onClick(this);
  });
  
  this.isFacedown = function() {
    return $label.hasClass("facedown");
  }

  this.setFace = function(faceState) {
    if (faceState === FaceState.Up) $label.removeClass("facedown");
    else $label.addClass("facedown");
  }

  this.getFacevalue = function() {
    return $label.html();
  }

  this.removeFromBoard = function() {
    $label.addClass("removed");
  }
}

export var cardCssRules = `.spruit-field.card > label {
  width: 3em;
  height: 2.5em;
  padding-top:0.5em;
  text-align: center;
  border: 0;
  margin: 0.5em;
  border-radius: 8px;
  background: #ffff00;
  border-right: 1px solid #999900;
  border-bottom: 1px solid #999900;
  color: #333300;
}
.spruit-field.card > label.facedown {
  background: #999900;
  color: #999900;
  border-right-color: #ffff00;
  border-bottom-color: #ffff00;
}
.spruit-field.card > label.removed {
  background: #9ACD32;
  color: #9ACD32;
  border-right-color: #9ACD32;
  border-bottom-color: #9ACD32;
}`;
