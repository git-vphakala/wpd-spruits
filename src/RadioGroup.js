export function RadioGroup(args) {
  let buttonNames = args.buttonNames,
      custom = args.custom,
      buttons,
      
      RadioButton = function(args) {
	let groupName = args.groupName,
	    $input,
	    $customButton,

	    handleClickCheckbox = function(e) {
	      // let $input = $(this).prev();
	      e.preventDefault();
	      $input[0].checked = $input[0].checked ? false : true;
	    };
    
	spruits.Component.call(this, args);
	
	$input = $("<input>", { type:"radio", name:groupName, value:this.name });
	
	$customButton = (custom !== false) ?
	  $("<span>", { class:"custombutton" })
	  .on("click", handleClickCheckbox) : "";
	
	this.$field.addClass("radiobutton-1" + ((custom === false) ? " def" : "")).append(
	  $input,
	  $customButton
	);

	this.getVal = function getVal(propName) {
	  let val;

	  switch(propName) {
	  case "val":
	  default:
	    val = $input[0].checked ? true : false;
	    break;
	  }

	  return val;
	};
      };

  spruits.Component.call(this, args);
  
  buttons = buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name });
  });
  buttons.forEach(comp => { this.$field.append(comp.$field); });

  this.getVal = function(propName) {
    let val, len, i;
    
    switch(propName) {
    case "val":
    default:
      len = buttons.length;
      for (i=0; i<len; i++) {
	if (buttons[i].get("val")) {
	  val = buttons[i].name;
	  break;
	}
      }
      break;
    }

    return val;
  };
} // RadioGroup

export const radioGroupCssRules = `.radiobutton-1 {
  display:block;
  padding-left:1em;
}
.radiobutton-1 input {
  opacity:0;
}
.radiobutton-1.def input {
  opacity:unset;
}
.radiobutton-1 .custombutton {
  height:1em;
  width:1em;
  background-color:#ffff00;
  display:inline-block;
  border-radius:50%;
  border-bottom:1px solid #999900;
  border-right:1px solid #999900;
  margin-left:-1em;
}
.radiobutton-1:hover input ~ .custombutton {
  background-color:#999900;
}
.radiobutton-1 .custombutton:after {
  content:"";
  display:inline-block;
  background-color:#FFFF00;
  width:0.5em;
  height:0.5em;
  border-radius:50%;
  margin-left:0.25em;
  margin-bottom:0.125em;
}
.radiobutton-1 input:checked ~ .custombutton:after {
  display:inline-block;
  background-color:#333300;
}`
